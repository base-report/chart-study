import type { Widget } from '$lib/data/types/Widget';
import type { ChartTimeFrame } from '$lib/data/types/ChartData';
import { CHART_TIME_FRAMES } from '$lib/data/types/ChartData';
import Chart from '$lib/components/widgets/chart/Chart.svelte';

const widgets: Widget[] = [
	{
		name: 'Chart',
		component: Chart,
		description: `Time series chart that can be displayed in the following timeFrames: ${CHART_TIME_FRAMES.join(
			', '
		)}.`,
		options: {
			timeFrame<T extends ChartTimeFrame>(timeFrame: T): { timeFrame: T } {
				return { timeFrame };
			}
		}
	}
];

export { widgets };
