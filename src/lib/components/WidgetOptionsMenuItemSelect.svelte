<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import { widgets } from '$lib/widgets';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import DropdownOption from '$lib/components/DropdownOption.svelte';
	import { assignWidgetToPane } from '$lib/store/panes';

	export let pane: Pane;
	export let select: string;

	$: widget = widgets.find((w) => w.name === pane.widget?.name);

	const updateWidgetSelect = (key: string, value: string) => {
		if (!pane.widget) return;

		const updatedWidget = {
			...pane.widget,
			options: {
				...pane.widget.options,
				[key]: value
			}
		};

		assignWidgetToPane(pane.id, updatedWidget);
	};
</script>

{#if pane.widget?.options && widget?.options?.[select]}
	<Dropdown>
		<svelte:fragment slot="label">
			{#if widget.options[select].alwaysShowLabel}
				{widget.options[select].label}:
			{/if}
			{pane.widget.options[select]}
		</svelte:fragment>
		<svelte:fragment slot="options">
			{#if widget?.options}
				{#each widget.options[select].options as opt}
					<DropdownOption handleClick={() => updateWidgetSelect(select, opt)}>{opt}</DropdownOption>
				{/each}
			{/if}
		</svelte:fragment>
	</Dropdown>
{/if}
