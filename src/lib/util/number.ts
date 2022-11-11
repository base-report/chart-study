const roundTo = (num: number, decimalsPlaces = 2): number => {
	const multiplier = 10 ** decimalsPlaces;
	return Math.round(num * multiplier) / multiplier;
};

export { roundTo };
