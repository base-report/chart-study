const getWeek = (_d: Date): number => {
	const d = _d.getTime();
	const yearStart = new Date(Date.UTC(_d.getUTCFullYear(), 0, 1)).getTime();
	const day = (_d.getUTCDay() || 7) - 4;
	const nearestThursday = d + day * 86400000;
	return Math.ceil(((nearestThursday - yearStart) / 86400000 + 1) / 7);
};

const parseDate = (dateString: string) => {
	const [date, time] = dateString.split(' ');
	const [y, m, d] = date.split('-').map((x) => parseInt(x));
	const [hr, min, sec] = time ? time.split(':').map((x) => parseInt(x)) : [16, 0, 0];

	// create a date object with the provided date and time in UTC
	let _date = new Date(Date.UTC(y, m - 1, d, hr, min, sec));

	// get the time offset between UTC and the provided time zone
	const offset = new Date().getTimezoneOffset();
	_date.setMinutes(_date.getMinutes() + offset);

	return _date;
};
export { getWeek, parseDate };
