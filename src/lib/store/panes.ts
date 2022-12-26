import { writable } from 'svelte/store';
import type { Pane } from '$lib/data/types/Pane';

const DEFAULT_PANES: Pane[] = [
	{
		id: 1
	},
	{
		id: 2,
		parentId: 1,
		split: 'right'
	}
];

const panes = writable<Pane[]>(DEFAULT_PANES);
const activePaneId = writable<number>(DEFAULT_PANES[0].id);

export { panes, activePaneId };
