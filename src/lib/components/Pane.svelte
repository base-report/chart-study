<script lang="ts">
	import { Pane } from 'svelte-splitpanes';

	export let id = '';
	export let isWrapper = false;
</script>

{#if !isWrapper}
	<Pane minSize={20}>
		<div {id} class="pane-content h-full w-full bg-white dark:bg-black">
			<slot />
		</div>
	</Pane>
{/if}
