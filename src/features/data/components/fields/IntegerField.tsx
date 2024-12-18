import * as R from 'ramda';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handleIntegerFieldBlur } from '../../utils/handleIntegerFieldBlur';
import { handleIntegerFieldKeyUp } from '../../utils/handleIntegerFieldKeyUp';
import { getGeneralizedFormFieldLabel as getLabel } from '../../utils/getGeneralizedFormFieldLabel';

/**
 * IntegerField component renders an input field for handling integer values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid domain input.
 *
 * @returns {JSX.Element} The rendered IntegerField component, an input field for integers.
 *
 * @description
 * The `IntegerField` component integrates with `react-hook-form` to manage an input field specifically for integer entries.
 * It validates integers on blur using `handleIntegerFieldBlur`, displaying a custom error message if the input is not an integer.
 * The component dynamically sets the required attribute based on `fieldSpec` and `operation`, and it disables input when
 * the form is in a submitting state.
 */
export const IntegerField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
	setError,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
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
	const label = getLabel(name, fieldSpec);

	return (
		<Input
			{...field}
			className='block w-full p-2 border rounded-md bg-white'
			onBlur={handleIntegerFieldBlur({
				field: R.pick(['onBlur'], field),
				setError,
			})}
			onKeyUp={handleIntegerFieldKeyUp({
				field: R.pick(['onChange'], field),
				setError,
			})}
			placeholder={label}
			required={required}
		/>
	);
};
