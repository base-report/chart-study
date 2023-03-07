import { z } from 'zod';
import { parseDate } from 'base-report-util';

const TimeseriesIntradaySchema = z
	.array(
		z.object({
			date: z.string(),
			open: z.number(),
			high: z.number(),
			low: z.number(),
			close: z.number(),
			volume: z.number().default(0)
		})
	)
	.default([])
	.transform((arr) =>
		arr
			.map(({ date, open, high, low, close, volume }) => [
				open,
				high,
				low,
				close,
				volume,
				new Date(parseDate(date)).getTime()
			])
			.reverse()
	);

type TimeseriesIntraday = z.infer<typeof TimeseriesIntradaySchema>;

export type { TimeseriesIntraday };
export { TimeseriesIntradaySchema };
