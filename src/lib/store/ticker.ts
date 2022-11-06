import { writable } from 'svelte/store';

const ticker = writable('');

export { ticker };
