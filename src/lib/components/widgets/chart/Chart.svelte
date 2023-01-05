<script lang="ts">
	import type { Chart } from 'klinecharts/types';
	import type { ChartTimeFrame } from '$lib/data/types/ChartData';
	import type { TimeoutType } from '$lib/data/types/TimeoutType';

	import { onMount, onDestroy } from 'svelte';
	import { init, dispose } from 'klinecharts';
	import { isDark } from '$lib/util/theme';
	import { ticker } from '$lib/store/ticker';
	import { fetchChartData, loading, chartData } from '$lib/store/timeseries';
	import Loader from '$lib/components/Loader.svelte';

	import { default as options } from './options';
	import { default as darkOptions } from './darkOptions';

	export let paneId: string;
	export let timeFrame: ChartTimeFrame = 'daily';

	$: id = `${paneId}-${timeFrame}-chart`;

	let chart: Chart;
	let timer: TimeoutType;
	let mounted = false;

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
		}, 0);
	};

	const handleContainerResize = () => {
		if (!chart) return;
		clearTimeout(timer);
		timer = setTimeout(() => chart.resize(), 50);
	};

	const addContainerResizeObserver = () => {
		const resizeObserver = new ResizeObserver(() => handleContainerResize());
		const container = document.getElementById(id);
		if (container) resizeObserver.observe(container);
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
</script>

<div {id} class="relative w-full h-full bg-white dark:bg-black">
	{#if $loading}
		<Loader />
	{/if}
</div>
