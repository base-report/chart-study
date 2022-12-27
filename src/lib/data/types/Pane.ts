type Splitpanes = {
	id: string;
	horizontal: boolean;
	children: Array<Splitpanes | Pane>;
};

type Pane = {
	id: string;
};

export type { Pane, Splitpanes };
