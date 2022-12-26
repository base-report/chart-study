import type { SplitDirection } from '$lib/data/types/SplitDirection';

type Pane = {
  id: number;
  parentId?: number;
  split?: SplitDirection;
}

export type { Pane };
