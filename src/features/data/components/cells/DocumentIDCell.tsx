import { getApiObjectYupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DocumentIDCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const collections = Object.keys(props.idPrefixByCollection);
	const apiYupHelpers = getApiObjectYupHelpers(
		collections,
		props.idPrefixByCollection,
	);

	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean =>
				apiYupHelpers.id(props._object).isValidSync(value)
			}
		/>
	);
};
