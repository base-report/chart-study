import { get } from 'svelte/store';
import { chartData } from '$lib/store/timeseries';

const DEFAULT_CODE = `/*
WARNING: This is a code editor that will run any JavaScript
you type in here. Please make sure you trust the source
of the code you are running.

The variable "daily" is available to you and contains the
daily time series data for the selected ticker. The shape 
of the data is: ChartData[], where ChartData is:
[open, high, low, close, volume, timestamp].

Your goal is to return an array of arrays of the following
shape: ChartData[][], which will be used to populate the 
table below. You can use the "Move finder" widget for 
inspiration of what to return.
*/
`;

const runCodeInWidget = (event: CustomEvent) => {
	const {
		pane: {
			widget: { options: code }
		}
	} = event.detail;
	try {
		const { daily } = get(chartData);
		const fn = new Function('daily', code.code);
		// TODO: return combos to the component
		fn(daily);
	} catch (e) {
		console.error(e);
	}
};

export { DEFAULT_CODE, runCodeInWidget };
