import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldLabel as getLabel } from '../../utils/getGeneralizedFormFieldLabel';
import { default as cn } from '../../../../lib/cn';

/**
 * ShortTextField component renders a standard text input field for handling short text values.
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
 * @returns {JSX.Element} The rendered ShortTextField component, an input field for short text entries.
 *
 * @description
 * The `ShortTextField` component integrates with `react-hook-form` to manage a short text input field.
 * It sets the required attribute based on `fieldSpec` and `operation`, and disables input during form submission.
 * This component is suitable for capturing brief, single-line text entries.
 */
export const ShortTextField = <
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
	const label = getLabel(name, fieldSpec);

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			placeholder={label}
			required={required}
		/>
	);
};
