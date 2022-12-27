<script lang="ts">
	import ArrowRectangleIcon from '$lib/components/icons/ArrowRectangle.svelte';
	import { performSplit } from '$lib/store/panes';

	const splitRight = () => performSplit('right');
	const splitDown = () => performSplit('down');
</script>

<span class="isolate inline-flex rounded-md shadow-sm">
	<button type="button" class="rounded-l-md" title="Split right" on:click={splitRight}>
		<span class="sr-only">Split right</span>
		<ArrowRectangleIcon direction="right" />
	</button>
	<button type="button" class="-ml-px rounded-r-md" title="Split down" on:click={splitDown}>
		<span class="sr-only">Split down</span>
		<ArrowRectangleIcon direction="down" />
	</button>
</span>

<style lang="postcss">
	button {
		@apply relative inline-flex items-center border border-indigo-800 bg-indigo-600 px-2 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-700 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500;
	}
</style>
