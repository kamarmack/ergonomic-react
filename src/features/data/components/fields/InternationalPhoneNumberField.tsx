// Make this more robust w.r.t country codes. Currently, it only works for +1.

import * as R from 'ramda';
import {
	countries,
	isFieldRequired,
	Country,
	defaultCountry,
	defaultCountryPhoneNumberRegionDisplayValue,
	getCountryPhoneNumberRegionDisplayValue,
	countriesSorted,
} from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handleInternationalPhoneNumberFieldBlur } from '../../utils/handleInternationalPhoneNumberFieldBlur';
import { handleInternationalPhoneNumberFieldKeyUp } from '../../utils/handleInternationalPhoneNumberFieldKeyUp';
import { default as cn } from '../../../../lib/cn';
import { useEffect, useState } from 'react';
import { Skeleton } from '../../../../components/ui/skeleton';
import { baseLocalStorageUtil } from '../../../../lib/localStorage';

/**
 * InternationalPhoneNumberField component renders an input field for handling phone numbers with a country code selector.
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
 * @returns {JSX.Element} The rendered InternationalPhoneNumberField component, a phone number input with country code selection.
 *
 * @description
 * The `InternationalPhoneNumberField` component integrates with `react-hook-form` to manage an input field for phone numbers,
 * with a selectable country code prefix. The input field automatically formats the phone number based on blur and key-up
 * events using helper functions to enforce valid formatting and to provide error feedback as necessary. The component
 * dynamically sets the required attribute based on `fieldSpec` and `operation`, and it disables inputs during form submission.
 */
export const InternationalPhoneNumberField = <
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
	const [phoneNumberCountry, setPhoneNumberCountry] = useState<Country | null>(
		null,
	);
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });

	useEffect(() => {
		const phoneNumberRegion =
			baseLocalStorageUtil.retrieveFromLocalStorage({
				key: 'phoneNumberRegion',
			}) || defaultCountry.two_letter_country_code;
		const selectedCountry =
			countries.find(
				(country) => country.two_letter_country_code === phoneNumberRegion,
			) || defaultCountry;
		setPhoneNumberCountry(() => selectedCountry);
	}, []);

	const isPhoneNumberCountryLoading = phoneNumberCountry === null;
	if (isPhoneNumberCountryLoading) {
		return (
			<div>
				{Array.from({ length: 1 }).map(() => (
					<Skeleton className='h-8' />
				))}
			</div>
		);
	}

	return (
		<div className='flex items-center space-x-2'>
			<div>
				<select
					className='block w-24 p-2 border rounded-md bg-white text-center'
					defaultValue={defaultCountryPhoneNumberRegionDisplayValue}
					disabled={disabled}
					onChange={(e) => {
						const [flagEmoji] = e.target.value.split(' '); // get the flag emoji, e.g. "🇸🇬"
						const selectedCountry = flagEmoji
							? countries.find((country) => country.flag_emoji === flagEmoji)
							: null;
						if (selectedCountry) {
							setPhoneNumberCountry(() => selectedCountry);
							baseLocalStorageUtil.saveToLocalStorage({
								key: 'phoneNumberRegion',
								value: selectedCountry.two_letter_country_code,
							});
						}
					}}
				>
					<option disabled value=''>
						Select one
					</option>
					{countriesSorted.map((country) => {
						const value = getCountryPhoneNumberRegionDisplayValue(country);
						return (
							<option key={country.two_letter_country_code} value={value}>
								{value}
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
					onBlur={handleInternationalPhoneNumberFieldBlur({
						field: R.pick(['onBlur'], field),
						setError,
					})}
					onKeyUp={handleInternationalPhoneNumberFieldKeyUp({
						field: R.pick(['onChange'], field),
						setError,
						phoneNumberRegion: phoneNumberCountry.two_letter_country_code,
					})}
					placeholder='(813) 555-1234'
					required={required}
				/>
			</div>
		</div>
	);
};
