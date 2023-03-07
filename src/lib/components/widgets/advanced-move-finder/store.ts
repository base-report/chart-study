import type { ChartData } from 'base-report-util';

import { get, writable } from 'svelte/store';

const combos = writable<{ [paneId: string]: ChartData[][] }>({});

const setCombosForPane = (paneId: string, _combos: ChartData[][]) => {
	const currentCombos = get(combos) as { [paneId: string]: ChartData[][] };
	combos.set({ ...currentCombos, [paneId]: _combos });
};

const removeCombosForPane = (paneId: string) => {
	const currentCombos = get(combos) as { [paneId: string]: ChartData[][] };
	delete currentCombos[paneId];
	combos.set(currentCombos);
};

export { combos, setCombosForPane, removeCombosForPane };
