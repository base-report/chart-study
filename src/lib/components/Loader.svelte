<script lang="ts">
	import { scale } from 'svelte/transition';
	import { Pulse } from 'svelte-loading-spinners';
</script>

<div class="flex h-32 items-center justify-center">
	<span
		in:scale={{ duration: 100, start: 0.95 }}
		out:scale={{ duration: 75, start: 0.95 }}
		class="py-1"
	>
		<Pulse color="rgb(79,70,229)" size="30" />
	</span>
</div>
