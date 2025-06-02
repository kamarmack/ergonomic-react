import { getPercentageFromFloatingPointNumber, yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const PercentageCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const num = value as number;
			return getPercentageFromFloatingPointNumber(num);
		}}
		isValid={(value: unknown): boolean => yupX.percentage().isValidSync(value)}
	/>
);
