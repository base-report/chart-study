<script lang="ts">
	import { scale } from 'svelte/transition';
	import XCircleIcon from '$lib/components/icons/X-Circle.svelte';
	import { alert } from '$lib/store/alert';
</script>

{#if $alert.text.length}
	<div
		class="rounded-md bg-red-50 p-4"
		in:scale={{ duration: 100, start: 0.95 }}
		out:scale={{ duration: 75, start: 0.95 }}
	>
		<div class="flex">
			<div class="flex-shrink-0">
				<XCircleIcon />
			</div>
			<div class="ml-3">
				<h3 class="text-sm font-medium text-red-800">{$alert.text}</h3>
			</div>
		</div>
	</div>
{/if}
