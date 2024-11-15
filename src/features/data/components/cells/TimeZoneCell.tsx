import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const TimeZoneCell = (props: GeneralizedTableCellProps): JSX.Element => {
	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean =>
				YupHelpers.timeZone().isValidSync(value)
			}
		/>
	);
};
