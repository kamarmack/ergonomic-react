import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const ListCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		isValid={(value: unknown): boolean => Array.isArray(value)}
	/>
);
