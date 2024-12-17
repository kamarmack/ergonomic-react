import { getApiResourceYupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DocumentIDReferenceCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const { resources = [], type } = props.fieldSpec?.meta || {};
	const isMulti = type === 'id_refs';
	const allResourceNames = Object.keys(props.idPrefixByResourceName);
	const apiYupHelpers = getApiResourceYupHelpers(
		allResourceNames,
		props.idPrefixByResourceName,
	);
	const isValueValid = (value: unknown) =>
		resources.some((_object) => apiYupHelpers.id(_object).isValidSync(value));

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
