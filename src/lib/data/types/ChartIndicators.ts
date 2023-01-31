type ChartIndicators = {
	MA10: boolean;
	MA20: boolean;
	MA50: boolean;
	MA100: boolean;
	MA200: boolean;
	ADR20: boolean;
};

const DEFAULT_CHART_INDICATORS: ChartIndicators = {
	MA10: true,
	MA20: true,
	MA50: true,
	MA100: false,
	MA200: false,
	ADR20: false
};

export type { ChartIndicators };
export { DEFAULT_CHART_INDICATORS };
