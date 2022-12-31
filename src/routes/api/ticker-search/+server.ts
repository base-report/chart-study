import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tickerSearch } from '$lib/fmp/tickerSearch';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('keywords');

	if (!query) {
		throw error(400, 'Missing search query');
	}

	try {
		const data = await tickerSearch(query);
		return json(data);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, message);
	}
};
