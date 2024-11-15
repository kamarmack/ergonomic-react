import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const AddressCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		isValid={(value: unknown): boolean => typeof value === 'string'}
	/>
);
