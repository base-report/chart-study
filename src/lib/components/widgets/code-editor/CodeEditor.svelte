<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { widgets } from '$lib/widgets';
	import { assignWidgetToPane } from '$lib/store/panes';

	export let paneId: string;
	export let code: string;

	$: widget = widgets.find((w) => w.name === 'Advanced move finder');

	const updateWidgetCode = () => {
		if (!widget?.options) return;

		const updatedWidget = {
			...widget,
			options: {
				paneId,
				code
			}
		};

		assignWidgetToPane(paneId, updatedWidget);
	};
</script>

<CodeMirror bind:value={code} on:change={updateWidgetCode} lang={javascript()} theme={oneDark} />
