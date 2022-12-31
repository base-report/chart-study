import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchTimeseriesDaily } from '$lib/fmp/timeseriesDaily';

export const GET: RequestHandler = async ({ url }) => {
	const ticker = url.searchParams.get('ticker');

	if (!ticker) {
		throw error(400, 'Missing ticker');
	}

	try {
		const data = await fetchTimeseriesDaily(ticker);
		return json(data);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, message);
	}
};
