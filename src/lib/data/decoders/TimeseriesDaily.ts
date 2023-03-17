import { z } from 'zod';
import { parseDate } from 'base-report-util';

const TimeseriesDailySchema = z
	.object({
		historical: z
			.array(
				z.object({
					date: z.string(),
					open: z.number(),
					high: z.number(),
					low: z.number(),
					close: z.number(),
					adjClose: z.nullable(z.number()).default(null),
					volume: z.number().default(0)
				})
			)
			.default([])
	})
	.transform(({ historical }) =>
		historical.map((d) => ({ ...d, date: parseDate(d.date) })).reverse()
	);

type TimeseriesDaily = z.infer<typeof TimeseriesDailySchema>;

export type { TimeseriesDaily };
export { TimeseriesDailySchema };
