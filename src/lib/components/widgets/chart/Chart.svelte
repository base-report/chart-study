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
	let visibleRangeCache = { from: 0, to: 0 };
	let intraDayBlacklistDays = {
		from: new Set<string>(),
		to: new Set<string>()
	};

	const fetchIntradayChartData = async ({
		from,
		to,
		scrollToTarget
	}: {
		from?: string;
		to?: string;
		scrollToTarget?: boolean;
	}) => {
		console.log('fetchIntradayChartData', from, to);
		console.log('intraDayBlacklistDays', intraDayBlacklistDays);
		if (from && intraDayBlacklistDays.from.has(from)) return;
		if (to && intraDayBlacklistDays.to.has(to)) return;

		try {
			loadingIntraday = true;
			let path = `/api/chart-data/intraday?ticker=${$ticker}&timeframe=${timeFrame}`;
			if (from) {
				path += `&from=${from}`;
			}
			if (to) {
				path += `&to=${to}`;
			}

			const response = await fetch(path);
			const _data = await response.json();

			if (from || to) {
				if (_data[0][5] === data[0][5]) {
					if (from) {
						intraDayBlacklistDays.from.add(from);
					}
					if (to) {
						intraDayBlacklistDays.to.add(to);
					}

					return;
				}

				const mergedData = [..._data, ...data];
				const uniqueTimestamps = new Set<number>();
				const uniqueData = [];
				const newTimestamps = _data.map((d) => d[5]);
				const newData = [];

				for (const d of mergedData) {
					const timestamp = d[5];
					if (!uniqueTimestamps.has(timestamp)) {
						uniqueTimestamps.add(timestamp);
						uniqueData.push(d);

						if (newTimestamps.includes(timestamp)) {
							newData.push(d);
						}
					}
				}

				const hasNewData = uniqueData.length > data.length;

				console.log('hasNewData', hasNewData, newData);

				if (hasNewData) {
					const visibleRange = getVisibleRange(chart);
					let scrollToIndex = -1;
					if (scrollToTarget) {
						const scrollToTimestamp = from ? _data[0][5] : _data[_data.length - 1][5];
						scrollToIndex = uniqueData.findIndex((d) => d[5] === scrollToTimestamp);
					} else {
						scrollToIndex = visibleRange.to + newData.length;
					}
					chart.applyNewData(
						uniqueData.map(([open, high, low, close, volume, timestamp]) => ({
							open,
							high,
							low,
							close,
							volume,
							timestamp
						}))
					);
					if (scrollToIndex > -1) {
						chart.scrollToDataIndex(scrollToIndex);
					}
				} else {
					if (from) {
						intraDayBlacklistDays.from.add(from);
					}
					if (to) {
						intraDayBlacklistDays.to.add(to);
					}
				}

				data = uniqueData.sort((a, b) => a[5] - b[5]);
				return newData;
			} else {
				data = _data;
				updateChart();
			}
		} catch (error) {
			console.error(error);
		} finally {
			loadingIntraday = false;
		}
	};

	const onSelectedMoveChange = async () => {
		if (!$selectedMove) return;
		removeEntryAndExit();
		await scrollChart();
		addEntryAndExit();
	};

	const scrollChart = async () => {
		// load more data if intraday timeframe

		let scrollToIndex = -1;

		if (isIntraday) {
			const exitDailyTimestamp = $selectedMove?.daily?.exit[5];
			if (!exitDailyTimestamp) return;
			const date = new Date(exitDailyTimestamp);
			const to = date.toISOString().split('T')[0];
			const newData = await fetchIntradayChartData({ to });
			if (newData) {
				scrollToIndex = data.findIndex((d) => d[5] === newData[newData.length - 1][5]);
			}
		} else {
			scrollToIndex = data.findIndex((d) => d[5] === $selectedMove[timeFrame]?.exit[5]);
		}

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

			chart.loadMore(async (timestamp: number) => {
				console.log('loadMore', timestamp);
				const date = new Date(timestamp);
				const isoDateString = date.toISOString().split('T')[0];
				await fetchIntradayChartData({ to: isoDateString });
			});

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
			await fetchIntradayChartData({});
		} else {
			await fetchChartData();
		}
	};

	const watchVisibleRange = () => {
		visibleRangeWatcher = setInterval(async () => {
			if (!isIntraday || !chart || loadingIntraday) return;

			const { from, to } = getVisibleRange(chart);

			if (from === visibleRangeCache.from && to === visibleRangeCache.to) return;

			let direction;
			if (from > visibleRangeCache.from) {
				direction = 'draggingToLeft';
			} else {
				direction = 'draggingToRight';
			}

			const visibleRangeData = data.slice(from, to);

			let largestGap: { gapHours: number; timestamp: number } = { gapHours: 0, timestamp: 0 };
			visibleRangeData.forEach((d, i) => {
				if (i > 0) {
					const prevTimestamp = visibleRangeData[i - 1][5];
					const timestamp = d[5];
					const gap = timestamp - prevTimestamp;
					const gapHours = gap / (60 * 60 * 1000);
					if (gapHours > largestGap.gapHours) {
						largestGap = { gapHours, timestamp };
					}
				}
			});

			const date = new Date(largestGap.timestamp);
			const isoDateString = date.toISOString().split('T')[0];
			let payload: { from?: string; to?: string; scrollToTarget?: boolean } = {
				scrollToTarget: true
			};
			if (direction === 'draggingToRight') {
				payload.to = isoDateString;
			} else if (direction === 'draggingToLeft') {
				payload.from = isoDateString;
			}
			await fetchIntradayChartData(payload);

			visibleRangeCache.from = from;
			visibleRangeCache.to = to;
			clearInterval(visibleRangeWatcher);
		}, 1000);
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
	$: timeFrame && isIntraday && fetchIntradayChartData({});
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
