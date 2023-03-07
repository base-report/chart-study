<script lang="ts">
	import type { Chart } from 'klinecharts/types';
	import type { ChartTimeFrame, Maybe, TimeoutType, IntervalType } from 'base-report-util';
	import type { ChartIndicators } from '$lib/data/types/ChartIndicators';

	import { onMount, onDestroy } from 'svelte';
	import { calculateAdrPct, INTRADAY_CHART_TIME_FRAMES } from 'base-report-util';
	import { isDark } from '$lib/util/theme';
	import { ticker } from '$lib/store/ticker';
	import { fetchChartData, loading, chartData, selectedMove } from '$lib/store/timeseries';
	import { DEFAULT_CHART_INDICATORS } from '$lib/data/types/ChartIndicators';
	import Loader from '$lib/components/Loader.svelte';

	import { default as options } from './options';
	import { default as darkOptions } from './darkOptions';
	import { getVisibleRange } from '$lib/util/chart';

	export let paneId: string;
	export let timeFrame: ChartTimeFrame = 'daily';
	export let indicators: ChartIndicators = DEFAULT_CHART_INDICATORS;

	$: id = `${paneId}-${timeFrame}-chart`;

	$: maIndicators = Object.entries(indicators).filter(([key]) => key.startsWith('MA'));

	$: otherIndicators = Object.entries(indicators).filter(([key]) => !key.startsWith('MA'));

	let chart: Chart;
	let timer: TimeoutType;
	let visibleRangeWatcher: IntervalType;
	let mounted = false;
	let init: Function;
	let dispose: Function;
	let loadingIntraday = false;
	let visibleRangeCache = { from: 0, to: 0, more: true };

	const fetchIntradayChartData = async (to?: string) => {
		if (!$ticker || !visibleRangeCache.more) return;

		try {
			loadingIntraday = true;
			let endpoint = `/api/chart-data/intraday?ticker=${$ticker}&timeframe=${timeFrame}`;
			if (to) {
				endpoint += `&to=${to}`;
			}
			const response = await fetch(endpoint);
			const _data = await response.json();

			if (to) {
				if (_data[0][5] === data[0][5]) {
					visibleRangeCache.more = false;
					return;
				}

				const currentFirstTimestamp = data[0][5];
				const newData = [];

				for (let i = 0; i < _data.length; i++) {
					// if timestamp is not the same, add to i position of data
					if (_data[i][5] < currentFirstTimestamp) {
						newData.push(_data[i]);
						data.splice(i, 0, _data[i]);
					} else {
						break;
					}
				}

				// if there is new data, apply more data
				if (newData.length) {
					chart.applyMoreData(
						newData.map(([open, high, low, close, volume, timestamp]) => ({
							open,
							high,
							low,
							close,
							volume,
							timestamp
						}))
					);
				}
			} else {
				data = _data;
				visibleRangeCache.more = true;
				updateChart();
			}
		} catch (error) {
			console.error(error);
		} finally {
			loadingIntraday = false;
		}
	};

	const onSelectedMoveChange = () => {
		if (!$selectedMove) return;
		removeEntryAndExit();
		scrollChart();
		addEntryAndExit();
	};

	const scrollChart = () => {
		const scrollToIndex = data.findIndex((d) => d[5] === $selectedMove[timeFrame]?.exit[5]);

		if (scrollToIndex > -1) {
			chart.scrollToRealTime();
			chart.scrollToDataIndex(scrollToIndex);
		}
	};

	const addEntryAndExit = () => {
		const entry = $selectedMove[timeFrame]?.entry;
		const exit = $selectedMove[timeFrame]?.exit;
		if (!entry || !exit) return;

		chart.createAnnotation(
			{
				point: { timestamp: entry[5], value: entry[2] },
				styles: {
					position: 'point',
					offset: [20, 0],
					symbol: {
						type: 'custom'
					}
				},
				drawCustomSymbol: ({ ctx, coordinate: { x, y } }) => {
					ctx.fillStyle = isDark ? '#FFF' : '#000';
					ctx.font = '13px sans-serif semibold';
					ctx.fillText('ENTRY', x - 20, y);
					ctx.fill();
				}
			},
			'candle_pane'
		);

		chart.createAnnotation(
			{
				point: { timestamp: exit[5], value: exit[2] },
				styles: {
					position: 'point',
					offset: [20, 0],
					symbol: {
						type: 'custom'
					}
				},
				drawCustomSymbol: ({ ctx, coordinate: { x, y } }) => {
					ctx.fillStyle = isDark ? '#FFF' : '#000';
					ctx.font = '13px sans-serif semibold';
					ctx.fillText('EXIT', x - 15, y);
					ctx.fill();
				}
			},
			'candle_pane'
		);
	};

	const removeEntryAndExit = () => chart.removeAnnotation('candle_pane');

	const updateChart = () => {
		if (!data.length || !mounted || $loading) return;

		dispose(chart);

		setTimeout(() => {
			const chartOptions = isDark ? darkOptions : options;
			chart = init(id, chartOptions);

			chart.createTechnicalIndicator('VOL', false, { height: 75 });
			chart.overrideTechnicalIndicator({
				name: 'VOL',
				calcParams: [20]
			});

			chart.applyNewData(
				data.map(([open, high, low, close, volume, timestamp]) => ({
					open,
					high,
					low,
					close,
					volume,
					timestamp
				}))
			);

			updateChartIndicators();
		}, 0);
	};

	const handleContainerResize = () => {
		clearTimeout(timer);
		if (!chart) return;

		timer = setTimeout(() => chart.resize(), 50);
	};

	const addContainerResizeObserver = () => {
		const resizeObserver = new ResizeObserver(() => handleContainerResize());
		const container = document.getElementById(id);
		if (container) resizeObserver.observe(container);
	};

	const updateChartMAIndicators = () => {
		if (!chart) return;

		chart.removeTechnicalIndicator('candle_pane', 'MA');

		chart.createTechnicalIndicator('MA', true, { id: 'candle_pane' });
		const calcParams = Object.entries(maIndicators).reduce((acc, [, [key, value]]) => {
			if (value) {
				const period = parseInt(key.replace('MA', ''));

				acc.push(period);
			}
			return acc;
		}, [] as number[]);
		chart.overrideTechnicalIndicator({
			name: 'MA',
			calcParams
		});
	};

	const updateChartOtherIndicators = () => {
		// TODO: add support for multiple time frames
		if (!chart || timeFrame !== 'daily') {
			return;
		}

		chart.removeTechnicalIndicator('other_indicators_pane', 'Other');

		if (otherIndicators.some(([, v]) => v)) {
			const calcParams = otherIndicators.reduce((acc, [key, value]) => {
				if (value) {
					acc.push(key);
				}
				return acc;
			}, [] as string[]);

			chart.addTechnicalIndicatorTemplate({
				name: 'Other',
				calcParams,
				minValue: 0,
				precision: 2,
				plots: calcParams.map((key) => ({ key, title: `${key}: `, type: 'line' })),
				calcTechnicalIndicator: (kLineDataList, { params, plots }) => {
					if (kLineDataList.length === 0) {
						return [];
					}

					return kLineDataList.map((_, i) => {
						if (i < 20) {
							return {};
						}

						let x: { [key: string]: Maybe<number> } = {};

						params.forEach((p: string, j: number) => {
							if (p === 'ADR20') {
								const adr = calculateAdrPct($chartData.daily.slice(i - 20, i + 1));
								x[plots[j].key] = adr;
							} else {
								x[plots[j].key] = null;
							}
						});

						return x;
					});
				}
			});
			chart.createTechnicalIndicator('Other', true, {
				id: 'other_indicators_pane',
				height: 60
			});
			chart.overrideTechnicalIndicator({
				name: 'Other',
				calcParams,
				styles: {
					line: { size: 1 }
				}
			});
		}
	};

	const updateChartIndicators = () => {
		updateChartMAIndicators();
		updateChartOtherIndicators();
	};

	onMount(async () => {
		const klinecharts = await import('klinecharts/index.blank.js');
		init = klinecharts.init;
		dispose = klinecharts.dispose;

		mounted = true;
		addContainerResizeObserver();
		watchVisibleRange();
	});

	const fetchData = async () => {
		if (isIntraday) {
			await fetchIntradayChartData();
		} else {
			await fetchChartData();
		}
	};

	const watchVisibleRange = () => {
		visibleRangeWatcher = setInterval(async () => {
			if (!isIntraday || !chart || loadingIntraday) return;

			const { from, to } = getVisibleRange(chart);

			if (from === visibleRangeCache.from && to === visibleRangeCache.to) return;

			if (visibleRangeCache.from && visibleRangeCache.to && from === 0) {
				const date = new Date(data[0][5]);
				const to = date.toISOString().split('T')[0];
				await fetchIntradayChartData(to);
			}
			visibleRangeCache.from = from;
			visibleRangeCache.to = to;
		}, 300);
	};

	onDestroy(() => {
		clearTimeout(timer);
		clearInterval(visibleRangeWatcher);

		dispose(chart);
		mounted = false;
	});

	$: isIntraday = INTRADAY_CHART_TIME_FRAMES.includes(timeFrame);
	$: data = isIntraday ? [] : $chartData[timeFrame];

	$: $ticker && fetchData();
	$: timeFrame && isIntraday && fetchIntradayChartData();
	$: id && $chartData && updateChart();
	$: id && indicators && updateChartIndicators();
	$: chart && $selectedMove && onSelectedMoveChange();
</script>

<div {id} class="relative h-full w-full bg-white dark:bg-black">
	{#if $loading || loadingIntraday}
		<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
			<Loader />
		</div>
	{/if}
</div>
