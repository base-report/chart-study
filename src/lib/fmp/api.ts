import { FMP_API_URL } from '$lib/env';
import { FMP_API_KEY } from '$lib/secrets';

const api = async <T>(path: string, version = 3): Promise<T> => {
	const prefix = path.includes('?') ? '&' : '?';
	const url = `${FMP_API_URL}/v${version}/${path}${prefix}apikey=${FMP_API_KEY}`;

	return fetch(url).then(async (response) => {
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();

		if (data['Error Message']) {
			throw new Error(data['Error Message']);
		}

		return data as Promise<T>;
	});
};

export { api };
