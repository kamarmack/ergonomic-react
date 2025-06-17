// Make this more robust w.r.t country codes. Currently, it only works for +1.

import * as R from 'ramda';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handleUnitedStatesPhoneNumberFieldBlur } from '../../utils/handleUnitedStatesPhoneNumberFieldBlur';
import { handleUnitedStatesPhoneNumberFieldKeyUp } from '../../utils/handleUnitedStatesPhoneNumberFieldKeyUp';
import { default as cn } from '../../../../lib/cn';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * UnitedStatesPhoneNumberField component renders an input field for handling phone numbers with a country code selector.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid phone number input.
 *
 * @returns {JSX.Element} The rendered UnitedStatesPhoneNumberField component, a phone number input with country code selection.
 *
 * @description
 * The `UnitedStatesPhoneNumberField` component integrates with `react-hook-form` to manage an input field for phone numbers,
 * with a selectable country code prefix. The input field automatically formats the phone number based on blur and key-up
 * events using helper functions to enforce valid formatting and to provide error feedback as necessary. The component
 * dynamically sets the required attribute based on `fieldSpec` and `operation`, and it disables inputs during form submission.
 */
export const UnitedStatesPhoneNumberField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	operation,
	setError,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'operation'
	| 'setError'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const { language } = useLanguage(baseTranslations);
	const placeholder = getPlaceholder(
		language,
		name,
		fieldSpec,
		'(813) 555-1234',
	);

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
					className={cn(
						'block w-full p-2 border rounded-md bg-white',
						className,
					)}
					onBlur={handleUnitedStatesPhoneNumberFieldBlur({
						field: R.pick(['onBlur'], field),
						setError,
					})}
					onKeyUp={handleUnitedStatesPhoneNumberFieldKeyUp({
						field: R.pick(['onChange'], field),
						setError,
					})}
					placeholder={placeholder}
					required={required}
				/>
			</div>
		</div>
	);
};
