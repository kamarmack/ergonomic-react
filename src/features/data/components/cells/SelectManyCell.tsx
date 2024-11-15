import { GeneralizedFieldSpec } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const SelectManyCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const innerType = props.fieldSpec?.innerType ?? ({} as GeneralizedFieldSpec);
	const options = innerType.oneOf ?? [];

	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean =>
				Array.isArray(value) &&
				value.every((item) => options.includes(item as string))
			}
		/>
	);
};
