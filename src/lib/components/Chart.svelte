<script lang="ts">
	import { fmpKey } from '$lib/store/fmp';
	import { ticker } from '$lib/store/ticker';

	let chartData = {
		daily: []
	};

	const fetchTimeseriesDaily = async () => {
		const url = `/api/timeseries-daily?ticker=${$ticker}&fmpKey=${$fmpKey}`;
		const response = await fetch(url);
		const data = await response.json();
		if (!response.ok && data.message) {
			throw new Error(data.message);
		}
		chartData.daily = data;
		// TODO: add weekly and monthly data and chart
	};

	ticker.subscribe((value) => {
		if (value) {
			fetchTimeseriesDaily();
		}
	});
</script>

<div>TODO: Chart</div>
