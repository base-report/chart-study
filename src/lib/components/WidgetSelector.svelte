<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import type { Widget } from '$lib/data/types/Widget';
	import { widgets } from '$lib/widgets';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import DropdownOption from '$lib/components/DropdownOption.svelte';
	import { assignWidgetToPane } from '$lib/store/panes';

	export let pane: Pane;

	const handleClick = (widget: Widget) => {
		const options = { paneId: pane.id, timeFrame: 'daily' };
		assignWidgetToPane(pane.id, { ...widget, options });
	};
</script>

<Dropdown showDropDown={!pane.widget}>
	<svelte:fragment slot="label">
		{#if pane.widget}
			{pane.widget.name}
		{:else}
			Select a widget
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="options">
		{#each widgets as widget}
			<DropdownOption handleClick={() => handleClick(widget)}>{widget.name}</DropdownOption>
		{/each}
	</svelte:fragment>
</Dropdown>
