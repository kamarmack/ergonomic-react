import { DateTime, Interval } from 'luxon';
import { yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const IntervalCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const interval = value as string;
			const isoInterval = Interval.fromISO(interval);
			const start = isoInterval.start.toLocaleString(DateTime.DATETIME_MED);
			const end = isoInterval.end.toLocaleString(DateTime.DATETIME_MED);
			return `${start} - ${end}`;
		}}
		isValid={(value: unknown): boolean => yupX.interval().isValidSync(value)}
	/>
);
