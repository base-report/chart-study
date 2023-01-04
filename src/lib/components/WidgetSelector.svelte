<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import type { Widget } from '$lib/data/types/Widget';
	import { widgets } from '$lib/widgets';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import DropdownOption from '$lib/components/DropdownOption.svelte';
	import { assignWidgetToPane } from '$lib/store/panes';

	export let pane: Pane;
	let showDropDown = false;

	const assignWidget = (widget: Widget) => {
		showDropDown = false;
		const options = {
			paneId: pane.id,
			...Object.entries(widget.options || {}).reduce(
				(acc, [k, v]) => ({ ...acc, [k]: v.default }),
				{}
			)
		};

		assignWidgetToPane(pane.id, { ...widget, options });
	};

	const clearWidget = () => assignWidgetToPane(pane.id, null);
</script>

<Dropdown bind:showDropDown>
	<svelte:fragment slot="label">
		{#if pane.widget}
			{pane.widget.name}
		{:else}
			Select a widget
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="options">
		{#each widgets as widget}
			<DropdownOption handleClick={() => assignWidget(widget)}>{widget.name}</DropdownOption>
		{/each}
		{#if pane.widget}
			<DropdownOption handleClick={() => clearWidget()}>Clear</DropdownOption>
		{/if}
	</svelte:fragment>
</Dropdown>
