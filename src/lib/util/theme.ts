import { browser } from '$app/environment';

const isDark =
	browser && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export { isDark };
