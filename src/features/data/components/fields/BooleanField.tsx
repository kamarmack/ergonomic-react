import { FieldValues, useController } from 'react-hook-form';
import { Checkbox } from '../../../../components/ui/checkbox';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * BooleanField component renders a checkbox input for handling boolean values within a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 *
 * @returns {JSX.Element} The rendered BooleanField component, which is a checkbox input to handle boolean values.
 *
 * @description
 * The `BooleanField` component integrates with `react-hook-form` to manage a checkbox input field
 * that represents a boolean value in a form. The component is disabled when the form is submitting.
 */
export const BooleanField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	'className' | 'control' | 'disabled' | 'fieldKey'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled,
		name,
	});

	return (
		<div className='flex'>
			<Checkbox
				{...field}
				className={className}
				checked={field.value}
				onCheckedChange={field.onChange}
			/>
		</div>
	);
};
