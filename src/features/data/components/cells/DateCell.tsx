import { DateTime } from 'luxon';
import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DateCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const date = value as string;
			return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL);
		}}
		isValid={(value: unknown): boolean => YupHelpers.date().isValidSync(value)}
	/>
);
