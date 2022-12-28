type Splitpanes = {
	type: 'SPLITPANES';
	id: string;
	horizontal: boolean;
	children: Array<Splitpanes | Pane>;
};

type Pane = {
	type: 'PANE';
	id: string;
};

export type { Pane, Splitpanes };
