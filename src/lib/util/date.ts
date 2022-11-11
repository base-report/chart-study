const getWeek = (_d: Date): number => {
	const d = new Date(Date.UTC(_d.getFullYear(), _d.getMonth(), _d.getDate()));

	// Set to nearest Thursday: current date + 4 - current day number
	// Make Sunday's day number 7
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

	// Get first day of year
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

	// Calculate full weeks to nearest Thursday
	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const parseDate = (dateString: string, timeZone = 'US/Eastern') => {
	const [date, time] = dateString.split(' ');
	const [y, m, d] = date.split('-').map((x) => parseInt(x));
	const [hr, min, sec] = time ? time.split(':').map((x) => parseInt(x)) : [16, 0, 0];

	const _date = new Date(Date.UTC(y, m - 1, d, hr, min, sec));
	const utcDate = new Date(_date.toLocaleString('en-US', { timeZone: 'UTC' }));
	const tzDate = new Date(_date.toLocaleString('en-US', { timeZone }));
	const offset = utcDate.getTime() - tzDate.getTime();
	_date.setTime(_date.getTime() + offset);
	return _date;
};

export { getWeek, parseDate };
