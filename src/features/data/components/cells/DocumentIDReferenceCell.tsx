import { getApiResourceYupFields } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DocumentIDReferenceCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const { resources = [], type } = props.fieldSpec?.meta || {};
	const isMulti = type === 'foreign_keys';
	const allResourceNames = Object.keys(props.idPrefixByResourceName);
	const apiYupFields = getApiResourceYupFields(
		allResourceNames,
		props.idPrefixByResourceName,
	);
	const isValueValid = (value: unknown) =>
		resources.some((_object) => apiYupFields.id(_object).isValidSync(value));

	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean =>
				isMulti
					? Array.isArray(value) && value.every(isValueValid)
					: isValueValid(value)
			}
		/>
	);
};
