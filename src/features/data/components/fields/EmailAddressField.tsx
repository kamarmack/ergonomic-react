import * as R from 'ramda';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handleEmailAddressFieldBlur } from '../../utils/handleEmailAddressFieldBlur';
import { default as cn } from '../../../../lib/cn';

/**
 * EmailAddressField component renders an input field for handling email address values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid email input.
 *
 * @returns {JSX.Element} The rendered EmailAddressField component, an input field for email addresses.
 *
 * @description
 * The `EmailAddressField` component integrates with `react-hook-form` to manage an input field specifically for email address entries.
 * It validates email values on blur using `handleEmailAddressFieldBlur`, displaying a custom error message if the input is not a valid email.
 * The component dynamically sets the required attribute based on `fieldSpec` and `operation`, and it disables input when
 * the form is in a submitting state.
 */
export const EmailAddressField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
	setError,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'fieldKey'
	| 'fieldSpec'
	| 'isSubmitting'
	| 'operation'
	| 'setError'
>): JSX.Element => {
	const disabled = isSubmitting;
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			onBlur={handleEmailAddressFieldBlur({
				field: R.pick(['onBlur'], field),
				setError,
			})}
			placeholder='john@example.com'
			required={required}
		/>
	);
};
