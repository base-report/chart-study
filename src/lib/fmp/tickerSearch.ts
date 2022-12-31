import { api } from '$lib/fmp/api';
import type { SearchResult } from '$lib/data/decoders/SearchResult';
import { SearchResultSchema } from '$lib/data/decoders/SearchResult';

const tickerSearch = async (query: string, limit = 20): Promise<SearchResult[]> => {
	const path = `search?query=${query}&limit=${limit}`;
	const results = await api<SearchResult[]>(path);
	if (results.length === 0) {
		throw new Error(`No results found for: ${query}`);
	}
	return results.map((r) => SearchResultSchema.parse(r));
};

export { tickerSearch };
