import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchTimeseriesDaily } from '$lib/fmp/timeseriesDaily';

export const GET: RequestHandler = async ({ url }) => {
	const ticker = url.searchParams.get('ticker');
	const fmpKey = url.searchParams.get('fmpKey');

	if (!ticker || !fmpKey) {
		throw error(400, 'Missing ticker or FMP API key');
	}

	try {
		const data = await fetchTimeseriesDaily(ticker, fmpKey);
		return new Response(JSON.stringify(data));
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, message);
	}
};
