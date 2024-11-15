import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const BooleanCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string =>
			(value as boolean) ? 'true' : 'false'
		}
		isValid={(value: unknown): boolean => typeof value === 'boolean'}
	/>
);
