import { getApiResourceYupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DocumentIDCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const allResourceNames = Object.keys(props.idPrefixByResourceName);
	const apiYupHelpers = getApiResourceYupHelpers(
		allResourceNames,
		props.idPrefixByResourceName,
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
