<script lang="ts">
	import type { ChartData } from '$lib/data/types/ChartData';
	import type { Chart } from 'klinecharts/types';
	import type { TimeoutType } from '$lib/data/types/TimeoutType';

	import { onMount } from 'svelte';
	import { init, dispose } from 'klinecharts';
	import { fmpKey } from '$lib/store/fmp';
	import { ticker } from '$lib/store/ticker';
	import { getChartData } from '$lib/util/timeseries';
	import { default as options } from '$lib/util/chart/options';
	import Loader from '$lib/components/Loader.svelte';

	let charts: Chart[] = [];
	let chartData: {
		daily: ChartData[];
		weekly: ChartData[];
		monthly: ChartData[];
	} = {
		daily: [],
		weekly: [],
		monthly: []
	};
	let timer: TimeoutType;
	let loading = false;

	const fetchChartData = async () => {
		try {
			loading = true;
			const url = `/api/timeseries-daily?ticker=${$ticker}&fmpKey=${$fmpKey}`;
			const response = await fetch(url);
			const data = await response.json();
			if (!response.ok && data.message) {
				throw new Error(data.message);
			}
			chartData = getChartData(data);
		} catch (error) {
			// TODO: Handle error
		} finally {
			loading = false;
		}
	};

	const updateCharts = () => {
		for (let c of charts) {
			dispose(c);
		}
		charts = [];
		if (!chartData.daily.length) {
			return;
		}

		for (let [key, data] of Object.entries(chartData)) {
			const chart: Chart = init(`${key}-chart`, options);

			const height = key === 'daily' ? 100 : 50;
			chart.createTechnicalIndicator('VOL', false, { height });
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

			charts.push(chart);
		}
	};

	const handleWindowResize = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			for (let chart of charts) {
				chart.resize();
			}
		}, 50);
	};

	const handleTickerChange = async () => {
		await fetchChartData();
		updateCharts();
	};

	$: $ticker && handleTickerChange();

	onMount(async () => {
		window.addEventListener('resize', handleWindowResize);
		return () => window.removeEventListener('resize', handleWindowResize);
	});
</script>

{#if loading}
	<Loader />
{:else}
	<div class="h-[calc(100vh-64px)] bg-white dark:bg-black sm:grid sm:grid-flow-col sm:grid-rows-3">
		<div id="daily-chart" class="relative sm:col-span-2 sm:row-span-2">
			<span
				class="absolute top-14 left-2 z-10 font-mono text-sm font-bold text-gray-900 text-opacity-40 dark:text-gray-300">
				DAILY
			</span>
		</div>
		<div class="flex sm:col-span-1">
			<div id="weekly-chart" class="chart relative">
				<span
					class="absolute top-5 left-2 z-10 font-mono text-sm font-bold text-gray-900 text-opacity-40 dark:text-gray-300">
					WEEKLY
				</span>
			</div>
		</div>
		<div class="flex sm:col-span-1">
			<div id="monthly-chart" class="chart relative">
				<span
					class="absolute top-5 left-2 z-10 font-mono text-sm font-bold text-gray-900 text-opacity-40 dark:text-gray-300">
					MONTHLY
				</span>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	#daily-chart {
		width: 100%;
	}

	#weekly-chart,
	#monthly-chart {
		width: 100%;
	}
</style>
