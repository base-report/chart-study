<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import { createEventDispatcher } from 'svelte';
	import { widgets } from '$lib/widgets';
	import { chartData } from '$lib/store/timeseries';
	import Button from '$lib/components/Button.svelte';

	export let pane: Pane;
	export let button: string;

	$: widget = widgets.find((w) => w.name === pane.widget?.name);

	const dispatch = createEventDispatcher();
	const dispatchMessage = () => dispatch('message', { pane, button });

	const handleClick = () => dispatchMessage();
	$: chartData.subscribe(() => dispatchMessage());
</script>

<Button {handleClick}>
	{widget?.options?.[button].label}
</Button>
