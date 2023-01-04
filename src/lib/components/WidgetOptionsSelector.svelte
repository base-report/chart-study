<script lang="ts">
	import type { Pane } from '$lib/data/types/Pane';
	import { widgets } from '$lib/widgets';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import DropdownOption from '$lib/components/DropdownOption.svelte';
	import { assignWidgetToPane } from '$lib/store/panes';

	export let pane: Pane;

	$: widget = widgets.find((w) => w.name === pane.widget?.name);
	$: selects = widget ? Object.keys(widget.options || {}).filter((k) => k !== 'paneId') : [];

	const updateWidget = (key: string, value: string) => {
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

{#each selects as select}
	{#if pane.widget && pane.widget.options}
		<Dropdown>
			<svelte:fragment slot="label">
				{pane.widget.options[select]}
			</svelte:fragment>
			<svelte:fragment slot="options">
				{#if widget && widget.options}
					{#each widget.options[select].options as opt}
						<DropdownOption handleClick={() => updateWidget(select, opt)}>{opt}</DropdownOption>
					{/each}
				{/if}
			</svelte:fragment>
		</Dropdown>
	{/if}
{/each}
