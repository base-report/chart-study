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
		const fn = new Function('widget', code.code);
		fn();
	} catch (e) {
		console.error(e);
	}
};

export { DEFAULT_CODE, runCodeInWidget };
