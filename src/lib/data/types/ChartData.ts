import { stringTuple } from '$lib/util/types';

type ChartData = [o: number, h: number, l: number, c: number, v: number, t: number];

const CHART_TIME_FRAMES = ['daily', 'weekly', 'monthly'];
const tfValues = stringTuple(...CHART_TIME_FRAMES);
type ChartTimeFrame = (typeof tfValues)[number]; // 'daily' | 'weekly' | 'monthly'
type MarkedMove = {
	entry: ChartData;
	exit: ChartData;
};

export type { ChartData, ChartTimeFrame, MarkedMove };
export { CHART_TIME_FRAMES };
