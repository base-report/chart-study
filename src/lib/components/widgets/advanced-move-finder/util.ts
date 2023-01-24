import { get } from 'svelte/store';
import { chartData } from '$lib/store/timeseries';
import { setCombosForPane } from './store';

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
inspiration on what to return.
*/

let movesFound = []; // array of arrays of ChartData

// add your code here

return movesFound
`;

const runCodeInWidget = (event: CustomEvent) => {
	const {
		pane: {
			id,
			widget: { options: code }
		}
	} = event.detail;
	try {
		const { daily } = get(chartData);
		const fn = new Function('daily', code.code);
		const movesFound = fn(daily);
		setCombosForPane(id, movesFound);
	} catch (e) {
		console.error(e);
	}
};

export { DEFAULT_CODE, runCodeInWidget };
