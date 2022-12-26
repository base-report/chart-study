<script lang="ts">
	import Pane from '$lib/components/Pane.svelte';
	import { panes } from '$lib/store/panes';
</script>

<div class="w-full h-full">
	{#each $panes as pane}
		<Pane id={pane.id} />
	{/each}
</div>
