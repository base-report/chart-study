<script lang="ts">
	import type { Chart } from 'klinecharts/types';
	import type { ChartTimeFrame } from '$lib/data/types/ChartData';
	import type { ChartIndicators } from '$lib/data/types/ChartIndicators';
	import type { TimeoutType } from '$lib/data/types/TimeoutType';

	import { onMount, onDestroy } from 'svelte';
	import { init, dispose } from 'klinecharts';
	import { isDark } from '$lib/util/theme';
	import { ticker } from '$lib/store/ticker';
	import { fetchChartData, loading, chartData, selectedMove } from '$lib/store/timeseries';
	import { DEFAULT_CHART_INDICATORS } from '$lib/data/types/ChartIndicators';
	import Loader from '$lib/components/Loader.svelte';

	import { default as options } from './options';
	import { default as darkOptions } from './darkOptions';

	export let paneId: string;
	export let timeFrame: ChartTimeFrame = 'daily';
	export let indicators: ChartIndicators = DEFAULT_CHART_INDICATORS;

	$: id = `${paneId}-${timeFrame}-chart`;

	let chart: Chart;
	let timer: TimeoutType;
	let mounted = false;

	const onSelectedMoveChange = () => {
		if (!$selectedMove) return;
		removeEntryAndExit();
		scrollChart();
		addEntryAndExit();
	};

	const scrollChart = () => {
		const scrollToIndex = $chartData[timeFrame].findIndex(
			(d) => d[5] === $selectedMove[timeFrame]?.exit[5]
		);

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
		if (!$chartData[timeFrame].length || !mounted || $loading) return;

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
				$chartData[timeFrame].map(([open, high, low, close, volume, timestamp]) => ({
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

	const updateChartIndicators = () => {
		if (!chart) return;

		chart.removeTechnicalIndicator('candle_pane', 'MA');

		chart.createTechnicalIndicator('MA', true, { id: 'candle_pane' });
		const calcParams = Object.entries(indicators).reduce((acc, [key, value]) => {
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

	onMount(() => {
		mounted = true;
		addContainerResizeObserver();
	});

	onDestroy(() => {
		dispose(chart);
		mounted = false;
	});

	$: $ticker && fetchChartData();
	$: id && $chartData && updateChart();
	$: id && indicators && updateChartIndicators();
	$: chart && $selectedMove && onSelectedMoveChange();
</script>

<div {id} class="relative h-full w-full bg-white dark:bg-black">
	{#if $loading}
		<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
			<Loader />
		</div>
	{/if}
</div>
