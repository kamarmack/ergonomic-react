import { getApiObjectYupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DocumentIDReferenceCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const { reference_collections = [], type } = props.fieldSpec?.meta || {};
	const isMulti = type === 'id_refs';
	const collections = Object.keys(props.idPrefixByCollection);
	const apiYupHelpers = getApiObjectYupHelpers(
		collections,
		props.idPrefixByCollection,
	);
	const isValueValid = (value: unknown) =>
		reference_collections.some((_object) =>
			apiYupHelpers.id(_object).isValidSync(value),
		);

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
