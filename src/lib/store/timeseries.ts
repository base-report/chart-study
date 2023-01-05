import type { ChartData, ChartTimeFrame } from '$lib/data/types/ChartData';

import { get, writable } from 'svelte/store';
import { ticker } from '$lib/store/ticker';
import { getChartData } from '$lib/util/timeseries';

const chartData = writable<{ [tf: ChartTimeFrame]: ChartData[] }>({
	daily: [],
	weekly: [],
	monthly: []
});

const loading = writable(false);

const fetchChartData = async () => {
	const _ticker = get(ticker);

	try {
		if (!get(loading)) {
			loading.set(true);
			const response = await fetch(`/api/timeseries-daily?ticker=${_ticker}`);
			const data = await response.json();
			loading.set(false);

			chartData.set(getChartData(data));
		}
	} catch (error) {
		loading.set(false);
		console.error(error);
	}
};

export { fetchChartData, loading, chartData };
