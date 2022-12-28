import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { Splitpanes, Pane } from '$lib/data/types/Pane';
import type { SplitDirection } from '$lib/data/types/SplitDirection';

const DEFAULT_PANES_TREE: Splitpanes = {
	type: 'SPLITPANES',
	id: 'splitpanes-1',
	horizontal: false,
	children: [
		{
			type: 'PANE',
			id: 'pane-1'
		}
	]
};

const stored = browser
	? (localStorage.panesTree && JSON.parse(localStorage.panesTree)) || DEFAULT_PANES_TREE
	: DEFAULT_PANES_TREE;

const panesTree = writable<Splitpanes>(stored);
const activePaneId = writable<string>(DEFAULT_PANES_TREE.children[0].id);
const panesCount = writable(1);
const splitpanesCount = writable(1);

panesTree.subscribe((tree: Splitpanes) => {
	if (browser) localStorage.panesTree = JSON.stringify(tree);
});

const findPaneWithParent = (
	id: string,
	tree: Splitpanes
): [Pane | undefined, Splitpanes | undefined] => {
	let pane: Pane | undefined;
	let parent: Splitpanes | undefined;

	for (const child of tree.children) {
		if (child.id === id) {
			pane = child as Pane;
			parent = tree;
			break;
		}
	}

	if (!pane) {
		for (const child of tree.children) {
			if ('children' in child) {
				const [_pane, _parent] = findPaneWithParent(id, child);
				if (_pane) {
					pane = _pane;
					parent = _parent;
					break;
				}
			}
		}
	}

	return [pane, parent];
};

const getUpdatedTree = (tree: Splitpanes, pane: Pane, direction: SplitDirection): Splitpanes => {
	const index = tree.children.findIndex((child) => child.id === pane.id);

	if (index === -1) {
		return {
			...tree,
			children: tree.children.map((child) => {
				if (child.type === 'SPLITPANES') {
					return getUpdatedTree(child, pane, direction);
				}
				return child;
			})
		};
	}

	const newPane: Pane = { type: 'PANE', id: `pane-${get(panesCount) + 1}` };

	const addPane = (): Splitpanes => {
		panesCount.update((n) => n + 1);
		return {
			...tree,
			children: [...tree.children.slice(0, index + 1), newPane, ...tree.children.slice(index + 1)]
		};
	};

	const replaceWithSplitpanes = (horizontal: boolean): Splitpanes => {
		const newSplitpanes: Splitpanes = {
			type: 'SPLITPANES',
			id: `splitpanes-${get(splitpanesCount) + 1}`,
			horizontal,
			children: [pane, newPane]
		};

		panesCount.update((n) => n + 1);
		splitpanesCount.update((n) => n + 1);

		return {
			...tree,
			children: [...tree.children.slice(0, index), newSplitpanes, ...tree.children.slice(index + 1)]
		};
	};

	return direction === 'down'
		? tree.horizontal
			? addPane()
			: replaceWithSplitpanes(true)
		: tree.horizontal
		? replaceWithSplitpanes(false)
		: addPane();
};

const performSplit = (direction: SplitDirection) => {
	const id = get(activePaneId);
	const currentTree = get(panesTree);

	const [pane, parent] = findPaneWithParent(id, currentTree);

	if (!pane || !parent) {
		return;
	}

	const updatedTree = getUpdatedTree(currentTree, pane, direction);
	panesTree.set(updatedTree);
};

export { panesTree, activePaneId, performSplit };
