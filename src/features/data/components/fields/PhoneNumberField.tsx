// Make this more robust w.r.t country codes. Currently, it only works for +1.

import * as R from 'ramda';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handlePhoneNumberFieldBlur } from '../../utils/handlePhoneNumberFieldBlur';
import { handlePhoneNumberFieldKeyUp } from '../../utils/handlePhoneNumberFieldKeyUp';

/**
 * PhoneNumberField component renders an input field for handling phone numbers with a country code selector.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid phone number input.
 *
 * @returns {JSX.Element} The rendered PhoneNumberField component, a phone number input with country code selection.
 *
 * @description
 * The `PhoneNumberField` component integrates with `react-hook-form` to manage an input field for phone numbers,
 * with a selectable country code prefix. The input field automatically formats the phone number based on blur and key-up
 * events using helper functions to enforce valid formatting and to provide error feedback as necessary. The component
 * dynamically sets the required attribute based on `fieldSpec` and `operation`, and it disables inputs during form submission.
 */
export const PhoneNumberField = <
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
		<div className='flex items-center space-x-2'>
			<div>
				<select
					className='block w-16 p-2 border rounded-md bg-white text-center'
					defaultValue={'+1'}
					disabled={disabled}
				>
					<option disabled value=''>
						Select one
					</option>
					{['+1'].map((option) => {
						return (
							<option key={option} value={option}>
								{option}
							</option>
						);
					})}
				</select>
			</div>
			<div className='w-full'>
				<Input
					{...field}
					className='block w-full p-2 border rounded-md bg-white'
					onBlur={handlePhoneNumberFieldBlur({
						field: R.pick(['onBlur'], field),
						setError,
					})}
					onKeyUp={handlePhoneNumberFieldKeyUp({
						field: R.pick(['onChange'], field),
						setError,
					})}
					placeholder='(813) 555-1234'
					required={required}
				/>
			</div>
		</div>
	);
};
