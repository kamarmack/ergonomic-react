import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const EmailAddressCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		isValid={(value: unknown): boolean =>
			YupHelpers.emailAddress().isValidSync(value)
		}
	/>
);
