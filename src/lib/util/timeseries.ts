import type { TimeseriesDaily } from '$lib/data/decoders/TimeseriesDaily';
import type { ChartData } from '$lib/data/types/ChartData';
import { roundTo } from '$lib/util/number';
import { getWeek } from '$lib/util/date';

const getChartData = (
	timeseriesDaily: TimeseriesDaily
): {
	daily: ChartData[];
	weekly: ChartData[];
	monthly: ChartData[];
} => {
	console.time('getChartData');
	const daily: ChartData[] = [];
	const weekly: ChartData[] = [];
	const monthly: ChartData[] = [];

	let week, month;

	// populate daily, weekly, and monthly series
	for (const d of timeseriesDaily) {
		const close = roundTo(d.close, 4);
		const ratio = roundTo((d.adjClose || close) / close, 4);
		const date = new Date(d.date);

		const o = roundTo(d.open * ratio, 4);
		const h = roundTo(d.high * ratio, 4);
		const l = roundTo(d.low * ratio, 4);
		const c = close * ratio;
		const v = roundTo(d.volume);
		const t = date.getTime();

		const dailyData: ChartData = [o, h, l, c, v, t];
		daily.push(dailyData);

		const currentWeek = getWeek(date);
		if (currentWeek !== week) {
			// if new week
			weekly[weekly.length] = dailyData;
			week = currentWeek;
		} else {
			// if same week
			const weekData = weekly[weekly.length - 1];
			weekly[weekly.length - 1] = [
				weekData[0],
				h > weekData[1] ? h : weekData[1],
				l < weekData[2] ? l : weekData[2],
				c,
				weekData[4] + v,
				t
			];
		}

		const currentMonth = date.getMonth();
		if (currentMonth !== month) {
			// if new month
			monthly[monthly.length] = dailyData;
			month = currentMonth;
		} else {
			// if same month
			const monthData = monthly[monthly.length - 1];
			monthly[monthly.length - 1] = [
				monthData[0],
				h > monthData[1] ? h : monthData[1],
				l < monthData[2] ? l : monthData[2],
				c,
				monthData[4] + v,
				t
			];
		}
	}

	console.timeEnd('getChartData');

	return { daily, weekly, monthly };
};

export { getChartData };
