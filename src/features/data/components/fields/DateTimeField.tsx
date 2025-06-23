import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';

/**
 * DateTimeField component renders an input field for handling date and time values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default value or validation rules.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered DateTimeField component, which is an input field for selecting date and time.
 *
 * @description
 * The `DateTimeField` component integrates with `react-hook-form` to manage an input field for date and time values.
 * It dynamically sets the required attribute based on `fieldSpec` and `operation` and disables input during form submission.
 * The component renders an input of type `datetime-local` for date and time selection.
 */
export const DateTimeField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'language'
	| 'operation'
>): JSX.Element => {
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
			type='datetime-local'
			required={required}
		/>
	);
};
