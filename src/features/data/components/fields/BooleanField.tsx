import { FieldValues, useController } from 'react-hook-form';
import { Checkbox } from '../../../../components/ui/checkbox';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * BooleanField component renders a checkbox input for handling boolean values within a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 *
 * @returns {JSX.Element} The rendered BooleanField component, which is a checkbox input to handle boolean values.
 *
 * @description
 * The `BooleanField` component integrates with `react-hook-form` to manage a checkbox input field
 * that represents a boolean value in a form. The component is disabled when the form is submitting.
 */
export const BooleanField = <
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
>({
	control,
	fieldKey: name,
	isSubmitting,
}: GeneralizedFormFieldProps<TFieldValues, TCollection>): JSX.Element => {
	const disabled = isSubmitting;
	const { field } = useController({
		control,
		disabled,
		name,
	});

	return (
		<div className='flex'>
			<Checkbox
				{...field}
				checked={field.value}
				onCheckedChange={field.onChange}
			/>
		</div>
	);
};
