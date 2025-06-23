import * as R from 'ramda';
import { handleUsdFieldKeyUp } from '../../utils/handleUsdFieldKeyUp';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * UsdField component renders an input field for handling currency values, formatted in USD cents.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default value or validation rules.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid currency input.
 *
 * @returns {JSX.Element} The rendered UsdField component, which is an input field for currency formatted in USD.
 *
 * @description
 * The `UsdField` component integrates with `react-hook-form` to manage an input field tailored for currency input in USD.
 * It uses `handleUsdFieldKeyUp` to format input values to cents and to validate against potential errors.
 * The component dynamically sets whether the field is required based on `fieldSpec` and `operation`, and disables input when the form is submitting.
 */
export const UsdField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	language,
	operation,
	setError,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'language'
	| 'operation'
	| 'setError'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const { language: fallbackLanguage } = useLanguage(baseTranslations);
	const placeholder = getPlaceholder(
		language || fallbackLanguage,
		name,
		fieldSpec,
		'$0.00',
	);

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			onKeyUp={handleUsdFieldKeyUp({
				field: R.pick(['onChange'], field),
				setError,
			})}
			placeholder={placeholder}
			required={required}
		/>
	);
};
