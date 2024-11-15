import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const SelectOneCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const options = props.fieldSpec.oneOf;

	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean => options.includes(value as string)}
		/>
	);
};
