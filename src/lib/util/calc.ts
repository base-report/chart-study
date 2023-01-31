import type { ChartData } from '$lib/data/types/ChartData';

const calculateAdrPct = (chartData: ChartData[]): number => {
	const candles = chartData.slice(chartData.length - 20, chartData.length);
	const adr = candles.reduce((total, d) => total + d[1] / d[2], 0) / candles.length - 1;
	return parseFloat((100 * adr).toFixed(2));
};

export { calculateAdrPct };
