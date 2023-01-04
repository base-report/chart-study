import type { Widget } from '$lib/data/types/Widget';
import { CHART_TIME_FRAMES } from '$lib/data/types/ChartData';
import Chart from '$lib/components/widgets/chart/Chart.svelte';

const widgets: Widget[] = [
	{
		name: 'Chart',
		component: Chart,
		options: {
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
