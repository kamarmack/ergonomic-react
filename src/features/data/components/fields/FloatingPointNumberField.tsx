import * as R from 'ramda';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handleFloatingPointFieldBlur } from '../../utils/handleFloatingPointFieldBlur';
import { handleFloatingPointFieldKeyUp } from '../../utils/handleFloatingPointFieldKeyUp';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import cn from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * FloatingPointNumberField component renders an input field for handling floating-point number values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid domain input.
 *
 * @returns {JSX.Element} The rendered FloatingPointNumberField component, an input field for entering floating-point numbers.
 *
 * @description
 * The `FloatingPointNumberField` component integrates with `react-hook-form` to manage an input field for floating-point
 * numbers. It automatically sets the `required` attribute based on `fieldSpec` and `operation`, and disables the input
 * field when the form is submitting. The component enforces numeric input, suitable for capturing decimal values.
 */
export const FloatingPointNumberField = <
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
	);

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			onBlur={handleFloatingPointFieldBlur({
				field: R.pick(['onBlur'], field),
				setError,
			})}
			onKeyUp={handleFloatingPointFieldKeyUp({
				field: R.pick(['onChange'], field),
				setError,
			})}
			placeholder={placeholder}
			required={required}
		/>
	);
};
