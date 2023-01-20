import type { TimeseriesDaily } from '$lib/data/decoders/TimeseriesDaily';

import { api } from '$lib/fmp/api';
import { TimeseriesDailySchema } from '$lib/data/decoders/TimeseriesDaily';

const fetchTimeseriesDaily = async (ticker: string): Promise<TimeseriesDaily> => {
	const path = `historical-price-full/${ticker}?timeseries=20000`;
	const result = await api<TimeseriesDaily>(path);
	const data = TimeseriesDailySchema.parse(result);

	if (!data || data.length === 0) {
		throw new Error(`No data available for: ${ticker}`);
	}

	return data;
};

export { fetchTimeseriesDaily };
