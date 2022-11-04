import { z } from 'zod';

const SearchResultSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	currency: z.string(),
	stockExchange: z.string(),
	exchangeShortName: z.string()
});

type SearchResult = z.infer<typeof SearchResultSchema>;

export type { SearchResult };
export { SearchResultSchema };
