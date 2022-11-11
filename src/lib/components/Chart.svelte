<script lang="ts">
	import type { ChartData } from '$lib/data/types/ChartData';

	import { fmpKey } from '$lib/store/fmp';
	import { ticker } from '$lib/store/ticker';
	import { getChartData } from '$lib/util/timeseries';

	let chartData: {
		daily: ChartData[];
		weekly: ChartData[];
		monthly: ChartData[];
	} = {
		daily: [],
		weekly: [],
		monthly: []
	};

	const fetchChartData = async () => {
		const url = `/api/timeseries-daily?ticker=${$ticker}&fmpKey=${$fmpKey}`;
		const response = await fetch(url);
		const data = await response.json();
		if (!response.ok && data.message) {
			throw new Error(data.message);
		}
		chartData = getChartData(data);
		// TODO: display charts using chartData
	};

	ticker.subscribe((value) => {
		if (value) {
			fetchChartData();
		}
	});
</script>

<div>TODO: Chart</div>
