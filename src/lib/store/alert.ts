import { writable } from 'svelte/store';
import type { Alert } from '$lib/data/interfaces/Alert';

const DEFAULT_ALERT: Alert = {
	text: '',
	type: 'info'
};

const alert = writable<Alert>(DEFAULT_ALERT);

const resetAlert = () => alert.set(DEFAULT_ALERT);

export { alert, resetAlert };
