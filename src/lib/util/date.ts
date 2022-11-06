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

export { parseDate };
