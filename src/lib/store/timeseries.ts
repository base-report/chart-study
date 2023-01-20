import type { ChartData, ChartTimeFrame, MarkedMove } from '$lib/data/types/ChartData';
import type { Maybe } from '$lib/data/types/Maybes';

import { get, writable } from 'svelte/store';
import { ticker } from '$lib/store/ticker';
import { getChartData } from '$lib/util/timeseries';

const chartData = writable<{ [tf: ChartTimeFrame]: ChartData[] }>({
	daily: [],
	weekly: [],
	monthly: []
});

const selectedMove = writable<{ [tf: ChartTimeFrame]: Maybe<MarkedMove> }>({
	daily: null,
	weekly: null,
	monthly: null
});

const loading = writable(false);

const fetchChartData = async () => {
	const _ticker = get(ticker);

	try {
		if (!get(loading)) {
			loading.set(true);
			console.time('fetchChartData');
			const response = await fetch(`/api/timeseries-daily?ticker=${_ticker}`);
			console.timeEnd('fetchChartData');
			const data = await response.json();
			loading.set(false);

			const _chartData = getChartData(data);
			chartData.set(_chartData);
		}
	} catch (error) {
		loading.set(false);
		console.error(error);
	}
};

const selectMove = (move: MarkedMove) => {
	const _chartData = get(chartData) as { [tf: ChartTimeFrame]: ChartData[] };
	const entryIndexDaily = _chartData.daily.findIndex((c) => c[5] === move.entry[5]);
	const exitIndexDaily = _chartData.daily.findIndex((c) => c[5] === move.exit[5]);

	const entryIndexWeekly = Math.floor(
		(entryIndexDaily / _chartData.daily.length) * _chartData.weekly.length
	);
	const exitIndexWeekly = Math.floor(
		(exitIndexDaily / _chartData.daily.length) * _chartData.weekly.length
	);

	const entryIndexMonthly = Math.floor(
		(entryIndexDaily / _chartData.daily.length) * _chartData.monthly.length
	);
	const exitIndexMonthly = Math.floor(
		(exitIndexDaily / _chartData.daily.length) * _chartData.monthly.length
	);

	selectedMove.set({
		daily: move,
		weekly: {
			entry: _chartData.weekly[entryIndexWeekly],
			exit: _chartData.weekly[exitIndexWeekly]
		},
		monthly: {
			entry: _chartData.monthly[entryIndexMonthly],
			exit: _chartData.monthly[exitIndexMonthly]
		}
	});
};

export { fetchChartData, loading, chartData, selectedMove, selectMove };
