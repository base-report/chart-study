<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { onDestroy } from 'svelte';
	import { javascript } from '@codemirror/lang-javascript';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { widgets } from '$lib/widgets';
	import { assignWidgetToPane } from '$lib/store/panes';
	import { isDark } from '$lib/util/theme';
	import MoveFinderTable from '$lib/components/widgets/move-finder/MoveFinderTable.svelte';
	import { combos, removeCombosForPane } from './store';

	export let paneId: string;
	export let code: string;

	$: widget = widgets.find((w) => w.name === 'Advanced move finder');
	$: theme = isDark ? oneDark : undefined;
	$: combosForPane = Object.keys($combos).includes(paneId) ? $combos[paneId] : [];

	onDestroy(() => removeCombosForPane(paneId));

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

<div class="flex h-full flex-col">
	<div class="max-h-[50%] overflow-x-auto">
		<CodeMirror bind:value={code} on:change={updateWidgetCode} lang={javascript()} {theme} />
	</div>
	<div class="grow overflow-x-auto">
		<MoveFinderTable combos={combosForPane} />
	</div>
</div>
