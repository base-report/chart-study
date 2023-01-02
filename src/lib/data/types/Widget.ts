import type { ComponentType } from 'svelte';

type Widget = {
	name: string;
	component: ComponentType;
	description?: string;
	options?: Record<string, any>;
};

export type { Widget };
