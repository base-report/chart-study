import type { Widget } from '$lib/data/types/Widget';
import { CHART_TIME_FRAMES } from '$lib/data/types/ChartData';
import { DEFAULT_CHART_INDICATORS } from '$lib/data/types/ChartIndicators';
import Chart from '$lib/components/widgets/chart/Chart.svelte';

const widgets: Widget[] = [
	{
		name: 'Chart',
		component: Chart,
		options: {
			indicators: {
				type: 'multi-select',
				label: 'Indicators',
				options: DEFAULT_CHART_INDICATORS,
				default: DEFAULT_CHART_INDICATORS
			},
			timeFrame: {
				type: 'select',
				label: 'Time Frame',
				options: CHART_TIME_FRAMES,
				default: CHART_TIME_FRAMES[0]
			}
		}
	}
];

export { widgets };
