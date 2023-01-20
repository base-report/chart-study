import type { Widget } from '$lib/data/types/Widget';
import { CHART_TIME_FRAMES } from '$lib/data/types/ChartData';
import { DEFAULT_CHART_INDICATORS } from '$lib/data/types/ChartIndicators';
import Chart from '$lib/components/widgets/chart/Chart.svelte';
import MoveFinder from '$lib/components/widgets/move-finder/MoveFinder.svelte';

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
	},
	{
		name: 'Move finder',
		component: MoveFinder,
		options: {
			entry: {
				type: 'select',
				label: 'Entry',
				alwaysShowLabel: true,
				options: [...[10, 20, 50].map((i) => `MA${i}`), 'EP'],
				default: 'MA10'
			},
			exit: {
				type: 'select',
				label: 'Exit',
				alwaysShowLabel: true,
				options: [...[10, 20, 50].map((i) => `MA${i}`)],
				default: 'MA10'
			},
			gains: {
				type: 'select',
				label: 'Gain',
				alwaysShowLabel: true,
				options: [20, 30, 40, 50, 100].map((i) => `> ${i}%`),
				default: '> 20%'
			}
		}
	}
];

export { widgets };
