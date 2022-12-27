<script lang="ts">
	import { activePaneId } from '$lib/store/panes';
	import { Pane } from 'svelte-splitpanes';

	export let id: string = '';
	export let isWrapper: boolean = false;

	$: isActive = $activePaneId === id;
</script>

{#if !isWrapper}
	<Pane minSize={20}>
		<div
			{id}
			class={`pane-content ${
				isActive ? 'bg-indigo-300' : 'bg-indigo-200'
			} w-full h-full text-black`}>
			<slot />
		</div>
	</Pane>
{/if}
