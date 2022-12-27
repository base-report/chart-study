const FMP_API_URL = 'https://financialmodelingprep.com/api';

const api = async <T>(path: string, fmpKey: string, version = 3): Promise<T> => {
	const prefix = path.includes('?') ? '&' : '?';
	const url = `${FMP_API_URL}/v${version}/${path}${prefix}apikey=${fmpKey}`;

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
