import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tickerSearch } from '$lib/fmp/tickerSearch';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('keywords');
	const fmpKey = url.searchParams.get('fmpKey');

	if (!query || !fmpKey) {
		throw error(400, 'Missing search query or fmpKey');
	}

	try {
		const data = await tickerSearch(query, fmpKey);
		return new Response(JSON.stringify(data));
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';
		throw error(500, message);
	}
};
