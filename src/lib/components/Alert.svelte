<script lang="ts">
	import { scale } from 'svelte/transition';
	import XCircleIcon from '$lib/components/icons/X-Circle.svelte';
	import { alert } from '$lib/store/alert';
</script>

{#if $alert.text.length}
	<div
		class="bg-red-50 p-4 dark:bg-orange-600"
		in:scale={{ duration: 100, start: 0.95 }}
		out:scale={{ duration: 75, start: 0.95 }}
	>
		<div class="flex text-red-400 dark:text-red-50">
			<div class="flex-shrink-0">
				<XCircleIcon />
			</div>
			<div class="ml-3">
				<h3 class="text-sm font-medium">{$alert.text}</h3>
			</div>
		</div>
	</div>
{/if}
