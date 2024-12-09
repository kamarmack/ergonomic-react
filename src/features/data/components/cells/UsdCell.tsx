import { YupHelpers, getCurrencyUsdStringFromCents } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const UsdCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const cents = value as number;
			return getCurrencyUsdStringFromCents(cents);
		}}
		isValid={(value: unknown): boolean => YupHelpers.usd().isValidSync(value)}
	/>
);
