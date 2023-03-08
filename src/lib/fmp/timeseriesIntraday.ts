import type { IntradayChartTimeFrame } from 'base-report-util';
import type { TimeseriesIntraday } from '$lib/data/decoders/TimeseriesIntraday';

import { api } from '$lib/fmp/api';
import { TimeseriesIntradaySchema } from '$lib/data/decoders/TimeseriesIntraday';

const fetchTimeseriesIntraday = async (
	ticker: string,
	timeframe: IntradayChartTimeFrame,
	from?: string,
	to?: string
): Promise<TimeseriesIntraday> => {
	let path = `historical-chart/${timeframe}/${ticker}`;
	if (from) {
		path += `?from=${from}`;
	}
	if (to) {
		const symbol = from ? '&' : '?';
		path += `${symbol}to=${to}`;
	}

	const result = await api<TimeseriesIntraday>(path);
	const data = TimeseriesIntradaySchema.parse(result);

	if (!data || data.length === 0) {
		throw new Error(`No intraday data available for: ${ticker}`);
	}

	return data;
};

export { fetchTimeseriesIntraday };
