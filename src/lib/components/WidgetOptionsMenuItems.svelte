<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import { widgets } from '$lib/widgets';
	import WidgetOptionsMenuItemSelect from '$lib/components/WidgetOptionsMenuItemSelect.svelte';
	import WidgetOptionsMenuItemMultiSelect from '$lib/components/WidgetOptionsMenuItemMultiSelect.svelte';
	import WidgetOptionsMenuItemButton from '$lib/components/WidgetOptionsMenuItemButton.svelte';

	export let pane: Pane;

	$: widget = widgets.find((w) => w.name === pane.widget?.name);
	$: widgetOptions = widget
		? Object.entries(widget.options || {}).filter(([k]) => k !== 'paneId')
		: [];

	$: selects = widgetOptions.filter(([, { type }]) => type === 'select');
	$: multiSelects = widgetOptions.filter(([, { type }]) => type === 'multi-select');
	$: buttons = widgetOptions.filter(([, { type }]) => type === 'button');
</script>

<div class="flex gap-2">
	{#each multiSelects as [select, { label }]}
		<WidgetOptionsMenuItemMultiSelect {pane} {select} {label} />
	{/each}

	{#each selects as [select]}
		<WidgetOptionsMenuItemSelect {pane} {select} />
	{/each}

	{#each buttons as [button, { action }]}
		<WidgetOptionsMenuItemButton on:message={action} {pane} {button} />
	{/each}
</div>
