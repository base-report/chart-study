<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import { widgets } from '$lib/widgets';
	import { assignWidgetToPane } from '$lib/store/panes';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import DropdownOption from '$lib/components/DropdownOption.svelte';

	export let pane: Pane;
	export let select: string;
	export let label: string;

	$: widget = widgets.find((w) => w.name === pane.widget?.name);

	const updateWidgetMultiSelect = (key: string, optionKey: string) => {
		if (!pane.widget) return;

		const multiSelectOptions = pane.widget.options ? pane.widget.options[key] : {};

		const updatedWidget = {
			...pane.widget,
			options: {
				...pane.widget.options,
				[key]: {
					...multiSelectOptions,
					[optionKey]: !multiSelectOptions[optionKey]
				}
			}
		};

		assignWidgetToPane(pane.id, updatedWidget);
	};
</script>

{#if pane.widget?.options}
	<Dropdown hideOnSelect={false}>
		<svelte:fragment slot="label">
			{label}
		</svelte:fragment>
		<svelte:fragment slot="options">
			{#if widget?.options}
				{#each Object.entries(pane.widget.options[select]) as [key, value]}
					<DropdownOption handleClick={() => updateWidgetMultiSelect(select, key)}>
						<div class="flex justify-between">
							{key}
							<input
								type="checkbox"
								name={key}
								value={key}
								checked={!!value}
								class="h-4 w-4 cursor-pointer rounded border-gray-300"
							/>
						</div>
					</DropdownOption>
				{/each}
			{/if}
		</svelte:fragment>
	</Dropdown>
{/if}
