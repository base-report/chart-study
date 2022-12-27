import { writable, derived, get } from 'svelte/store';
import type { Splitpanes, Pane } from '$lib/data/types/Pane';
import type { SplitDirection } from '$lib/data/types/SplitDirection';

const DEFAULT_PANES_TREE: Splitpanes = {
	id: 'splitpanes-1',
	horizontal: false,
	children: [
		{
			id: 'pane-1'
		},
		{
			id: 'splitpanes-2',
			horizontal: true,
			children: [
				{
					id: 'pane-2'
				},
				{
					id: 'pane-4'
				},
				{
					id: 'pane-5'
				}
			]
		},
		{
			id: 'pane-3'
		}
	]
};

const panesTree = writable<Splitpanes>(DEFAULT_PANES_TREE);
const activePaneId = writable<string>(DEFAULT_PANES_TREE.children[0].id);
const panesCount = writable(5);
const splitpanesCount = writable(2);

const findPaneWithParent = (
	id: string,
	tree: Splitpanes
): [Pane | undefined, Splitpanes | undefined] => {
	let pane: Pane | undefined;
	let parent: Splitpanes | undefined;

	for (const child of tree.children) {
		if (child.id === id) {
			pane = child;
			parent = tree;
			break;
		}
	}

	if (!pane) {
		for (const child of tree.children) {
			if ('children' in child) {
				let [_pane, _parent] = findPaneWithParent(id, child);
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
	const newPane = {
		id: `pane-${get(panesCount) + 1}`
	};

	const index = tree.children.findIndex((child) => child.id === pane.id);

	if (index === -1) {
		return {
			...tree,
			children: tree.children.map((child) => {
				if ('children' in child) {
					return getUpdatedTree(child, pane, direction);
				}
				return child;
			})
		};
	}

	const addPane = () => {
		panesCount.update((n) => n + 1);
		return {
			...tree,
			children: [...tree.children.slice(0, index + 1), newPane, ...tree.children.slice(index + 1)]
		};
	};

	const replaceWithSplitpanes = (horizontal: boolean) => {
		const newSplitpanes = {
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
