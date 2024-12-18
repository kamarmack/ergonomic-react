import { isFieldRequired } from 'ergonomic';
import { FieldValues, useController } from 'react-hook-form';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';

/**
 * SensitiveTextField component renders a password input field for handling sensitive text values.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
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
	TResourceName extends string = string,
>({
	className = '',
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'fieldKey'
	| 'fieldSpec'
	| 'isSubmitting'
	| 'operation'
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
			placeholder='•••••••••••'
			required={required}
			type='password'
		/>
	);
};
