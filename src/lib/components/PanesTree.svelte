<script lang="ts">
	import type { Splitpanes as SP_TYPE } from '$lib/data/types/Pane';
	import type { Widget } from '$lib/data/types/Widget';
	import { Splitpanes } from 'svelte-splitpanes';
	import Pane from '$lib/components/Pane.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import WidgetSelector from '$lib/components/WidgetSelector.svelte';
	import { activePaneId } from '$lib/store/panes';
	import { widgets } from '$lib/widgets';

	export let tree: SP_TYPE;

	const activatePane = (e: CustomEvent) => {
		const pane = e.detail;

		const hasChildPanes = !!pane.element.querySelector('.splitpanes');
		if (hasChildPanes) {
			return;
		}

		const paneId = pane.element.querySelector('.pane-content').id;
		activePaneId.set(paneId);
	};

	const getWidgetComponent = (_widget: Widget | undefined) => {
		if (!_widget) {
			return null;
		}

		const widget = widgets.find((w) => w.name === _widget.name);
		if (!widget) {
			return null;
		}

		return { component: widget.component, options: _widget.options || {} };
	};
</script>

<Splitpanes horizontal={tree.horizontal} on:pane-click={activatePane}>
	{#each tree.children as node}
		{#if node.type === 'SPLITPANES'}
			<Pane>
				<svelte:self tree={node} />
			</Pane>
		{:else}
			<Pane id={node.id}>
				<Toolbar id={node.id}>
					<WidgetSelector pane={node} />
				</Toolbar>
				{@const c = getWidgetComponent(node.widget)}
				{#if c}
					<svelte:component this={c.component} {...c.options} />
				{/if}
			</Pane>
		{/if}
	{/each}
</Splitpanes>

<style global lang="postcss">
	.splitpanes__splitter {
		@apply border-0 bg-indigo-100 dark:bg-indigo-900 !important;
	}

	.splitpanes__splitter:before,
	.splitpanes__splitter:after {
		@apply bg-indigo-500 !important;
	}
</style>
