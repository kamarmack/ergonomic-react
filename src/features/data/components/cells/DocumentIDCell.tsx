import { getApiResourceYupFields } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DocumentIDCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => {
	const allResourceNames = Object.keys(props.idPrefixByResourceName);
	const apiYupFields = getApiResourceYupFields(
		allResourceNames,
		props.idPrefixByResourceName,
	);

	return (
		<DefaultCell
			{...props}
			isValid={(value: unknown): boolean =>
				apiYupFields.id(props._object).isValidSync(value)
			}
		/>
	);
};
