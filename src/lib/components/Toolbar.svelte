<script lang="ts">
	import { activePaneId, onePaneLeft, removePane } from '$lib/store/panes';
	import XCircleIcon from '$lib/components/icons/X-Circle.svelte';

	export let id = '';

	$: isActive = $activePaneId === id;
</script>

<nav
	class="{isActive
		? 'bg-indigo-200 dark:bg-gray-900'
		: 'bg-indigo-50 dark:bg-gray-800'} relative z-20 drop-shadow"
>
	<div class="mx-auto w-full px-2">
		<div class="flex h-8 items-center gap-2">
			<div class="mr-6 flex w-full justify-between gap-2">
				<slot />
			</div>
			{#if !$onePaneLeft}
				<button
					type="button"
					class="absolute top-1.5 right-1 z-20 font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400  dark:hover:text-gray-200 "
					title="Remove pane"
					on:click={() => removePane(id)}
				>
					<XCircleIcon />
				</button>
			{/if}
		</div>
	</div>
</nav>
