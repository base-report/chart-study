<script lang="ts">
	import type { ChartData } from '$lib/data/types/ChartData';

	import { fmpKey } from '$lib/store/fmp';
	import { ticker } from '$lib/store/ticker';
	import { getChartData } from '$lib/util/timeseries';
	import Loader from '$lib/components/Loader.svelte';
	import Chart from '$lib/components/Chart.svelte';

	let chartData: {
		daily: ChartData[];
		weekly: ChartData[];
		monthly: ChartData[];
	} = {
		daily: [],
		weekly: [],
		monthly: []
	};
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

	$: $ticker && fetchChartData();
</script>

{#if loading}
	<Loader />
{:else}
	<div class="h-[calc(100vh-64px)] bg-white dark:bg-black sm:grid sm:grid-flow-col sm:grid-rows-3">
		<div class="flex sm:col-span-2 sm:row-span-2">
			<Chart timeframe="daily" chartData={chartData.daily} />
		</div>
		<div class="flex sm:col-span-1">
			<Chart timeframe="weekly" chartData={chartData.weekly} />
		</div>
		<div class="flex sm:col-span-1">
			<Chart timeframe="monthly" chartData={chartData.monthly} />
		</div>
	</div>
{/if}
