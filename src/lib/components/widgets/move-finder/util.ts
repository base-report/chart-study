import type { NumberOrNA } from '$lib/data/types/NumberOrNA';
import type { ChartData } from '$lib/data/types/ChartData';
import type { EntryStrategy, ExitStrategy } from '$lib/data/types/Strategy';

const round = (value: NumberOrNA, decimals: number): NumberOrNA =>
	value === 'N/A' ? 'N/A' : Number(value.toFixed(decimals));

const sma = (candles: ChartData[]) =>
	candles.map((c) => c[3]).reduce((a, b) => a + b) / candles.length;

const getCombos = ({
	candles,
	entryStrategy,
	exitStrategy,
	minGain
}: {
	candles: ChartData[];
	entryStrategy: EntryStrategy;
	exitStrategy: ExitStrategy;
	minGain: number;
}): ChartData[][] => {
	const d = exitStrategy || 10;
	const g = minGain || 0.3;

	const combos: ChartData[][] = [];

	let combo = null;
	for (let i = 0; i < candles.length; i++) {
		if (i <= d) continue;

		const new_candle = candles[i - 1];
		const new_open = new_candle[0];
		const new_close = new_candle[3];

		if (!combo) {
			const prev_candle = candles[i - 2];
			const prev_close = prev_candle[3];
			const prev_sma = sma([...candles].splice(i - (d + 2), d));

			if (entryStrategy === 'EP') {
				if ((new_open - prev_close) / prev_close > 0.1) {
					combo = [new_candle];
				}
			} else {
				const new_start_sma = sma([...candles].splice(i - (entryStrategy + 2), entryStrategy));

				if (prev_close <= prev_sma && new_close > new_start_sma) {
					combo = [new_candle];
				}
			}
		} else {
			combo.push(new_candle);

			const new_end_sma = sma([...candles].splice(i - (d + 1), d));
			if (new_close <= new_end_sma) {
				const start_close = combo[0][3];
				const end_close = combo[combo.length - 1][3];

				if ((end_close - start_close) / start_close > g) {
					combos.push(combo);
				}

				combo = null;
			}
		}
	}

	return combos;
};

export { round, sma, getCombos };
