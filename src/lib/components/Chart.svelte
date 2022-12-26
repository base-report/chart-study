<script lang="ts">
	import type { ChartData } from '$lib/data/types/ChartData';
	import type { Chart } from 'klinecharts/types';
	import type { TimeoutType } from '$lib/data/types/TimeoutType';

	import { onMount } from 'svelte';
	import { init, dispose } from 'klinecharts';
	import { default as options } from '$lib/util/chart/options';

	export let timeframe: string; // TODO: add type
	export let chartData: ChartData[];

	let chart: Chart;
	let timer: TimeoutType;
	let mounted: boolean = false;

	const updateChart = () => {
		dispose(chart);
		if (!chartData.length || !mounted) return;

		chart = init(`${timeframe}-chart`, options);

		chart.createTechnicalIndicator('VOL', false, { height: 75 });
		chart.overrideTechnicalIndicator({
			name: 'VOL',
			calcParams: [20]
		});

		chart.applyNewData(
			chartData.map(([open, high, low, close, volume, timestamp]) => ({
				open,
				high,
				low,
				close,
				volume,
				timestamp
			}))
		);
	};

	const handleContainerResize = () => {
		if (!chart) return;
		clearTimeout(timer);
		timer = setTimeout(() => chart.resize(), 50);
	};

	const addContainerResizeObserver = () => {
		const resizeObserver = new ResizeObserver(() => handleContainerResize());
		const container = document.getElementById(`${timeframe}-chart`);
		if (container) resizeObserver.observe(container);
	};

	onMount(() => {
		mounted = true;
		updateChart();
		addContainerResizeObserver();
	});

	$: chartData && updateChart();
</script>

<div id={`${timeframe}-chart`} class="chart relative">
	<span
		class="absolute top-0 right-16 z-10 font-mono uppercase text-sm font-bold text-gray-900 text-opacity-40 dark:text-gray-300"
	>
		{timeframe}
	</span>
</div>

<style lang="postcss">
	.chart {
		width: 100%;
	}
</style>
