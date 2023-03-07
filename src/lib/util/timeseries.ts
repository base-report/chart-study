import type { TimeseriesDaily } from '$lib/data/decoders/TimeseriesDaily';
import type { ChartData } from 'base-report-util';
import { roundTo } from '$lib/util/number';
import { getWeek } from 'base-report-util';

const getChartData = (
	timeseriesDaily: TimeseriesDaily
): {
	daily: ChartData[];
	weekly: ChartData[];
	monthly: ChartData[];
} => {
	const daily: ChartData[] = [];
	const weekly = new Map<number, ChartData>();
	const monthly = new Map<number, ChartData>();

	let week = -1;
	let month = -1;
	let weekCounter = 0;
	let monthCounter = 0;

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
	}

	return { daily, weekly: [...weekly.values()], monthly: [...monthly.values()] };
};

export { getChartData };
