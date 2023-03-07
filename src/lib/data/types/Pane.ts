import type { Maybe } from 'base-report-util';
import type { Widget } from '$lib/data/types/Widget';

type Splitpanes = {
	type: 'SPLITPANES';
	id: string;
	horizontal: boolean;
	children: Array<Splitpanes | Pane>;
};

type Pane = {
	type: 'PANE';
	id: string;
	widget?: Maybe<Widget>;
};

export type { Pane, Splitpanes };
