import { yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const EmailAddressCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		isValid={(value: unknown): boolean =>
			yupX.emailAddress().isValidSync(value)
		}
	/>
);
