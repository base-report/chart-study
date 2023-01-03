<script lang="ts">
	import { activePaneId } from '$lib/store/panes';

	export let id = '';

	$: isActive = $activePaneId === id;
</script>

<nav
	class={`${
		isActive ? 'bg-indigo-200 dark:bg-gray-900' : 'bg-indigo-50 dark:bg-gray-800'
	}  relative z-20 drop-shadow `}
>
	<div class="mx-auto w-full px-4">
		<div class="flex h-8 items-center gap-2">
			<slot />
		</div>
	</div>
</nav>
