import * as R from 'ramda';
import { handleCurrencyFieldKeyUp } from '../../utils/handleCurrencyFieldKeyUp';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * CurrencyField component renders an input field for handling currency values, formatted in USD cents.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default value or validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid currency input.
 *
 * @returns {JSX.Element} The rendered CurrencyField component, which is an input field for currency formatted in USD.
 *
 * @description
 * The `CurrencyField` component integrates with `react-hook-form` to manage an input field tailored for currency input in USD.
 * It uses `handleCurrencyFieldKeyUp` to format input values to cents and to validate against potential errors.
 * The component dynamically sets whether the field is required based on `fieldSpec` and `operation`, and disables input when the form is submitting.
 */
export const CurrencyField = <
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
>({
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
	setError,
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
			className='block w-full p-2 border rounded-md bg-white'
			onKeyUp={handleCurrencyFieldKeyUp({
				field: R.pick(['onChange'], field),
				setError,
			})}
			placeholder='$0.00'
			required={required}
		/>
	);
};
