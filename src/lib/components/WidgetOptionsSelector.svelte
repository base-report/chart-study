<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import { widgets } from '$lib/widgets';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import DropdownOption from '$lib/components/DropdownOption.svelte';
	import { assignWidgetToPane } from '$lib/store/panes';

	export let pane: Pane;

	$: widget = widgets.find((w) => w.name === pane.widget?.name);
	$: widgetOptions = widget
		? Object.entries(widget.options || {}).filter(([k]) => k !== 'paneId')
		: [];

	$: selects = widgetOptions.filter(([, { type }]) => type === 'select');
	$: multiSelects = widgetOptions.filter(([, { type }]) => type === 'multi-select');
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

{#each multiSelects as [select, { label, options }]}
	{#if pane.widget && pane.widget.options}
		<Dropdown hideOnSelect={false}>
			<svelte:fragment slot="label">
				{label}
			</svelte:fragment>
			<svelte:fragment slot="options">
				{#if widget && widget.options}
					{#each Object.entries(pane.widget.options[select]) as [key, value]}
						<DropdownOption handleClick={() => updateWidgetMultiSelect(select, key)}>
							<div class="flex justify-between">
								{key}
								<input
									type="checkbox"
									name={key}
									value={key}
									checked={value}
									class="h-4 w-4 rounded border-gray-300 cursor-pointer"
								/>
							</div>
						</DropdownOption>
					{/each}
				{/if}
			</svelte:fragment>
		</Dropdown>
	{/if}
{/each}

{#each selects as [select]}
	{#if pane.widget && pane.widget.options}
		<Dropdown>
			<svelte:fragment slot="label">
				{pane.widget.options[select]}
			</svelte:fragment>
			<svelte:fragment slot="options">
				{#if widget && widget.options}
					{#each widget.options[select].options as opt}
						<DropdownOption handleClick={() => updateWidgetSelect(select, opt)}
							>{opt}</DropdownOption
						>
					{/each}
				{/if}
			</svelte:fragment>
		</Dropdown>
	{/if}
{/each}
