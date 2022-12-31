import { browser } from '$app/environment';

const getEnvVar = (name: string): string | boolean | undefined => {
	// not in browser and not in production
	return !browser && process !== undefined && process.env.NODE_ENV !== 'production'
		? import.meta.env[`VITE_${name}`]
		: process.env[name];
};

export const FMP_API_KEY = getEnvVar('FMP_API_KEY') as string;
