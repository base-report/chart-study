import type { RequestHandler } from './$types';
import { getChartData } from '$lib/util/timeseries';

import { json, error } from '@sveltejs/kit';
import { fetchTimeseriesDaily } from '$lib/fmp/timeseriesDaily';

export const GET: RequestHandler = async ({ url }) => {
	const ticker = url.searchParams.get('ticker');

	if (!ticker) {
		throw error(400, 'Missing ticker');
	}

	try {
		const timeseriesDaily = await fetchTimeseriesDaily(ticker);
		const data = getChartData(timeseriesDaily);
		return json(data);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, message);
	}
};
