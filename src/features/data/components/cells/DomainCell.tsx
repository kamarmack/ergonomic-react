import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DomainCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		isValid={(value: unknown): boolean =>
			YupHelpers.domain().isValidSync(value)
		}
	/>
);
