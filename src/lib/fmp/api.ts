import { SECRET_FMP_API_URL, SECRET_FMP_API_KEY } from '$env/static/private';

const api = async <T>(path: string, version = 3): Promise<T> => {
	const prefix = path.includes('?') ? '&' : '?';
	const url = `${SECRET_FMP_API_URL}/v${version}/${path}${prefix}apikey=${SECRET_FMP_API_KEY}`;

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
