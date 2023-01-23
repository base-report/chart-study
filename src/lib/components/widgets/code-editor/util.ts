import { get } from 'svelte/store';
import { chartData } from '$lib/store/timeseries';

const DEFAULT_CODE = `/*
Warning: This is a code editor that will run any code you type in here.
Please make sure you trust the source of the code you are running.
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
		// TODO: add docs about daily in default code
		// TODO: add docs about how to use the data in the code
		// TODO: add docs about what to return from the code
		fn(daily);
	} catch (e) {
		console.error(e);
	}
};

export { DEFAULT_CODE, runCodeInWidget };
