import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';
import { getFormattedPercentageStringFromFloatingPointNumber } from '../../utils/getFormattedPercentageStringFromFloatingPointNumber';

export const PercentageCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const num = value as number;
			return getFormattedPercentageStringFromFloatingPointNumber(num);
		}}
		isValid={(value: unknown): boolean =>
			YupHelpers.percentage().isValidSync(value)
		}
	/>
);
