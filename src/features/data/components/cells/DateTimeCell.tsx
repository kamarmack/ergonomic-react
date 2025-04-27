import { DateTime } from 'luxon';
import { yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DateTimeCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const date = value as string;
			return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL);
		}}
		isValid={(value: unknown): boolean => yupX.dateTime().isValidSync(value)}
	/>
);
