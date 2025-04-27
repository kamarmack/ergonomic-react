import { yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const TimeZoneCell = (props: GeneralizedTableCellProps): JSX.Element => {
	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean => yupX.timeZone().isValidSync(value)}
		/>
	);
};
