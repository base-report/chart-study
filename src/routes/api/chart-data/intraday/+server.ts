import type { RequestHandler } from './$types';
import type { IntradayChartTimeFrame } from 'base-report-util';

import { json, error } from '@sveltejs/kit';
import { fetchTimeseriesIntraday } from '$lib/fmp/timeseriesIntraday';

export const GET: RequestHandler = async ({ url }) => {
	const ticker = url.searchParams.get('ticker');
	const timeframe = url.searchParams.get('timeframe');
	const to = url.searchParams.get('to');

	if (!ticker) {
		throw error(400, 'Missing ticker');
	}

	try {
		const data = await fetchTimeseriesIntraday(
			ticker,
			timeframe as IntradayChartTimeFrame,
			to || undefined
		);
		return json(data);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, message);
	}
};
