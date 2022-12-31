import { browser } from '$app/environment';

const getEnvVar = (name: string): string | boolean | undefined => {
	return browser || (process !== undefined && process.env.NODE_ENV !== 'production')
		? import.meta.env[name]
		: process.env[name];
};

export const FMP_API_URL = getEnvVar('VITE_FMP_API_URL') as string;
