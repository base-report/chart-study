import type { Chart } from 'klinecharts/types';

// TODO: consider refactoring into base-report-util or upgrade to klinecharts 9
const getVisibleRange = (chart: Chart) => {
	const visibleData = chart?._chartPane?._chartStore?._visibleDataList || [];
	const visibleRange = {
		from: visibleData[0]?.index || 0,
		to: visibleData[visibleData.length - 1]?.index || 0
	};
	return visibleRange;
};

export { getVisibleRange };
