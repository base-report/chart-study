<script lang="ts">
	import type { Splitpanes as SP_TYPE } from '$lib/data/types/Pane';
	import { Splitpanes } from 'svelte-splitpanes';
	import Pane from '$lib/components/Pane.svelte';
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
	{#each tree.children as pane}
		{#if pane.type === 'SPLITPANES'}
			<Pane>
				<svelte:self tree={pane} />
			</Pane>
		{:else}
			<Pane id={pane.id}>{pane.id}</Pane>
		{/if}
	{/each}
</Splitpanes>
