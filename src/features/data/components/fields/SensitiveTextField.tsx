import { isFieldRequired } from 'ergonomic';
import { FieldValues, useController } from 'react-hook-form';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * SensitiveTextField component renders a password input field for handling sensitive text values.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Specifications for the field, including validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered SensitiveTextField component, an input field for password or sensitive text.
 *
 * @description
 * The `SensitiveTextField` component integrates with `react-hook-form` to manage a password input field,
 * suitable for capturing sensitive text entries such as passwords. The component sets the required attribute
 * dynamically based on `fieldSpec` and `operation`, and disables input during form submission. It displays
 * a placeholder of obscured characters for added security.
 */
export const SensitiveTextField = <
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
>({
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
}: GeneralizedFormFieldProps<TFieldValues, TCollection>): JSX.Element => {
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
			placeholder='•••••••••••'
			required={required}
			type='password'
		/>
	);
};
