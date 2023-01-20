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
	const weekly = new Map<number, ChartData>();
	const monthly = new Map<number, ChartData>();

	let week: number, month: number;
	let weekCounter = 0;
	let monthCounter = 0;

	// populate daily, weekly, and monthly series
	timeseriesDaily.forEach((d) => {
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
			weekCounter++;
			weekly.set(weekCounter, dailyData);
			week = currentWeek;
		} else {
			// if same week
			const weekData = weekly.get(weekCounter);
			if (weekData) {
				weekly.set(weekCounter, [
					weekData[0],
					h > weekData[1] ? h : weekData[1],
					l < weekData[2] ? l : weekData[2],
					c,
					weekData[4] + v,
					t
				]);
			}
		}

		const currentMonth = date.getMonth();
		if (currentMonth !== month) {
			// if new month
			monthCounter++;
			monthly.set(monthCounter, dailyData);
			month = currentMonth;
		} else {
			// if same month
			const monthData = monthly.get(monthCounter);
			if (monthData) {
				monthly.set(monthCounter, [
					monthData[0],
					h > monthData[1] ? h : monthData[1],
					l < monthData[2] ? l : monthData[2],
					c,
					monthData[4] + v,
					t
				]);
			}
		}
	});

	console.timeEnd('getChartData');

	return { daily, weekly: [...weekly.values()], monthly: [...monthly.values()] };
};

export { getChartData };
