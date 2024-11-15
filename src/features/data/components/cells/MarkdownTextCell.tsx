import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const MarkdownTextCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		isValid={(value: unknown): boolean => typeof value === 'string'}
	/>
);
