import { yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const IntegerCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const num = value as number;
			return new Intl.NumberFormat().format(num);
		}}
		isValid={(value: unknown): boolean => yupX.integer().isValidSync(value)}
	/>
);
