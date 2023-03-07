import type { Maybe } from 'base-report-util';
import type { Splitpanes, Pane } from '$lib/data/types/Pane';
import type { SplitDirection } from '$lib/data/types/SplitDirection';
import type { Widget } from '$lib/data/types/Widget';

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

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
panesTree.subscribe((tree: Splitpanes) => {
	if (browser) localStorage.panesTree = JSON.stringify(tree);
});

const ids = derived(panesTree, ($panesTree) => {
	const paneIds = new Set<number>();
	const splitpanesIds = new Set<number>();

	const traverse = (node: Splitpanes | Pane) => {
		if (node.type === 'PANE') {
			paneIds.add(parseInt(node.id.split('-')[1]));
		} else {
			splitpanesIds.add(parseInt(node.id.split('-')[1]));
			node.children.forEach(traverse);
		}
	};
	traverse($panesTree);
	return { paneIds, splitpanesIds };
});

const defaultPaneId = derived(ids, ({ paneIds }) => `pane-${paneIds.values().next().value}`);

const activePaneId = writable<string>(get(defaultPaneId));

const onePaneLeft = derived(ids, ($ids) => $ids.paneIds.size === 1);

const getNewPaneId = (): string => {
	const { paneIds } = get(ids);
	const newId = Math.max(...paneIds) + 1;
	return `pane-${newId}`;
};

const getNewSplitpanesId = (): string => {
	const { splitpanesIds } = get(ids);
	const newId = Math.max(...splitpanesIds) + 1;
	return `splitpanes-${newId}`;
};

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

	const newPane: Pane = { type: 'PANE', id: getNewPaneId() };

	const addPane = (): Splitpanes => ({
		...tree,
		children: [...tree.children.slice(0, index + 1), newPane, ...tree.children.slice(index + 1)]
	});

	const replaceWithSplitpanes = (horizontal: boolean): Splitpanes => {
		const newSplitpanes: Splitpanes = {
			type: 'SPLITPANES',
			id: getNewSplitpanesId(),
			horizontal,
			children: [pane, newPane]
		};

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

const assignWidgetToPane = (paneId: string, widget: Maybe<Widget>) => {
	const currentTree = get(panesTree);
	const [pane, parent] = findPaneWithParent(paneId, currentTree);

	if (!pane || !parent) {
		return;
	}

	const getUpdatedTree = (tree: Splitpanes, pane: Pane, widget: Maybe<Widget>): Splitpanes => {
		const index = tree.children.findIndex((child) => child.id === pane.id);

		if (index === -1) {
			return {
				...tree,
				children: tree.children.map((child) => {
					if (child.type === 'SPLITPANES') {
						return getUpdatedTree(child, pane, widget);
					}
					return child;
				})
			};
		}

		return {
			...tree,
			children: [
				...tree.children.slice(0, index),
				{ ...pane, widget },
				...tree.children.slice(index + 1)
			]
		};
	};

	const updatedTree = getUpdatedTree(currentTree, pane, widget);
	panesTree.set(updatedTree);
};

// Clean up tree, if a splitpanes has only one child which is another splitpanes,
// replace the child with the grandchild. Do this recursively. If a splitpanes has
// no children, remove it.

const cleanUpTree = (tree: Splitpanes): Splitpanes => {
	if (tree.children.length === 1 && tree.children[0].type === 'SPLITPANES') {
		return cleanUpTree(tree.children[0]);
	}

	return {
		...tree,
		children: tree.children.map((child) => {
			if (child.type === 'SPLITPANES') {
				return cleanUpTree(child);
			}
			return child;
		})
	};
};

const removePane = (paneId: string) => {
	if (get(onePaneLeft)) {
		return;
	}

	const currentTree = get(panesTree);
	const [pane, parent] = findPaneWithParent(paneId, currentTree);

	if (!pane || !parent) {
		return;
	}

	if (parent.children.length === 1) {
		removePane(parent.id);
		return;
	}

	const getUpdatedTree = (tree: Splitpanes): Splitpanes => {
		const index = tree.children.findIndex((child) => child.id === paneId);

		if (index === -1) {
			return {
				...tree,
				children: tree.children.map((child) => {
					if (child.type === 'SPLITPANES') {
						return getUpdatedTree(child);
					}
					return child;
				})
			};
		}

		const updatedChildren = [...tree.children.slice(0, index), ...tree.children.slice(index + 1)];

		return {
			...tree,
			children: updatedChildren
		};
	};

	const updatedTree = getUpdatedTree(currentTree);
	panesTree.set(updatedTree);

	activePaneId.set(get(defaultPaneId));

	panesTree.update((tree) => cleanUpTree(tree));
};

export { panesTree, activePaneId, performSplit, assignWidgetToPane, removePane, onePaneLeft };
