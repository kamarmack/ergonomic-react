import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const FloatingPointNumberCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const num = value as number;
			return new Intl.NumberFormat(undefined, {
				maximumFractionDigits: 10,
			}).format(num);
		}}
		isValid={(value: unknown): boolean =>
			YupHelpers.floatingPointNumber().isValidSync(value)
		}
	/>
);
