<script lang="ts">
	import type { Splitpanes as SP_TYPE } from '$lib/data/types/Pane';
	import { Splitpanes } from 'svelte-splitpanes';
	import Pane from '$lib/components/Pane.svelte';
	import Chart from '$lib/components/widgets/chart/Chart.svelte';
	import { activePaneId } from '$lib/store/panes';

	export let tree: SP_TYPE;

	const activatePane = (e: CustomEvent) => {
		const pane = e.detail;

		const hasChildPanes = !!pane.element.querySelector('.splitpanes');
		if (hasChildPanes) {
			return;
		}

		const paneId = pane.element.querySelector('.pane-content').id;
		activePaneId.set(paneId);
	};
</script>

<Splitpanes horizontal={tree.horizontal} on:pane-click={activatePane}>
	{#each tree.children as node}
		{#if node.type === 'SPLITPANES'}
			<Pane>
				<svelte:self tree={node} />
			</Pane>
		{:else}
			<Pane id={node.id}>
				<!-- TODO: use dynamic component here -->
				<Chart paneId={node.id} />
			</Pane>
		{/if}
	{/each}
</Splitpanes>

<style global lang="postcss">
	.splitpanes__splitter {
		@apply border-0 bg-indigo-100 dark:bg-indigo-900 !important;
	}

	.splitpanes__splitter:before,
	.splitpanes__splitter:after {
		@apply bg-indigo-500 !important;
	}
</style>
