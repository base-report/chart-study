<script lang="ts">
	import { activePaneId } from '$lib/store/panes';

	export let id: number;

	const activatePane = () => {
		activePaneId.set(id);
		console.log('activated pane', $activePaneId);
	};

	$: isActive = $activePaneId === id;
</script>

<div
	id={`pane-${id}`}
	class={`${
		isActive ? 'border border-indigo-700' : ''
	} w-full h-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
	on:click={activatePane}
	on:keyup={activatePane}
>
	Pane
</div>
