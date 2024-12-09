// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type getGeneralizedFormDataFromServerData } from './getGeneralizedFormDataFromServerData';

import { getCurrencyUsdCents } from 'ergonomic';
import {
	defaultGeneralizedFormDataTransformationOptions,
	GeneralizedFormDataTransformationOptions,
} from '../types/GeneralizedFormDataTransformationOptions';

/**
 * Transforms form data from React Hook Form into a format that can be sent to the server.
 *
 * React Hook Form does not allow us to use arrays of strings as values for inputs. Instead, it requires us to use arrays of objects with "value" and "id" properties. This function transforms such arrays into simple string arrays. Additionally, specified fields representing values that need special handling, such as currency fields, are transformed into from their user-friendly format back into a format that can be sent to the server.
 *
 * This function is the inverse of {@link getGeneralizedFormDataFromServerData}.
 *
 * @param obj - Form data object
 * @param options - Additional options
 * @param options.currencyFieldKeys - Field keys that represent currency fields
 * @param options.dateTimeLocalFieldKeys - Field keys that represent date-time-local fields
 * @param options.floatingPointNumberFieldKeys - An array of keys representing fields that should be treated as floating point number values.
 * @param options.integerFieldKeys - An array of keys representing fields that should be treated as integer values.
 * @param options.percentageFieldKeys - An array of keys representing fields that should be treated as percentage values.
 * @param options.phoneNumberFieldKeys - An array of keys representing fields that should be treated as phone number values.
 * @returns Transformed form data object that can be sent to the server
 *
 * @example
 * ```typescript
 * const formData = {
 *   name: 'John Doe',
 *   age: 30,
 *   hobbies: [
 *      { value: 'Reading', id: '1' },
 *      { value: 'Swimming', id: '2' },
 *      { value: 'Cycling', id: '3' },
 *   ],
 *   salary: '$250,000.00',
 *   date_of_birth: '1961-12-31T19:00', // UTC-5 offset in yyyy-MM-ddTHH:mm format
 *   weight: '81,646.6', // in grams
 *   num_followers: '1,548',
 *   interest_rate: '5%',
 *   cell_number: '(415) 555-2671',
 * };
 * const serverData = getGeneralizedServerDataFromFormData(
 *   formData,
 *   {
 *      currencyFieldKeys: ['salary'],
 *      dateTimeLocalFieldKeys: ['date_of_birth'],
 *      floatingPointNumberFieldKeys: ['weight'],
 *      integerFieldKeys: ['num_followers'],
 *      percentageFieldKeys: ['interest_rate'],
 *      phoneNumberFieldKeys: ['cell_number'],
 *   },
 * );
 * // => {
 * //   name: 'John Doe',
 * //   age: 30,
 * //   hobbies: ['Reading', 'Swimming', 'Cycling'],
 * //   salary: 25000000,
 * //   date_of_birth: '1962-01-01T00:00:00.000Z',
 * //   weight: 81646.6,
 * //   num_followers: 1548,
 * //   interest_rate: 0.05,
 * //   cell_number: '+14155552671',
 * // }
 * ```
 */
export const getGeneralizedServerDataFromFormData = <
	T extends Record<string, unknown>,
>(
	obj: T,
	options: GeneralizedFormDataTransformationOptions = defaultGeneralizedFormDataTransformationOptions,
): T => {
	const transformedObj = {} as T;

	for (const key in obj) {
		const value = obj[key];
		if (
			Array.isArray(value) &&
			value.every(
				(item: { value: string; id: string }) =>
					item.value &&
					typeof item.value === 'string' &&
					item.id &&
					typeof item.id === 'string',
			)
		) {
			// Transform arrays of objects with "value" properties into simple string arrays
			transformedObj[key] = value.map(
				(item: { value: string }) => item.value,
			) as T[Extract<keyof T, string>];
		} else if (options?.currencyFieldKeys?.includes(key)) {
			if (value == null || value === '') {
				transformedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const currencyUsdCents = getCurrencyUsdCents(value);
				transformedObj[key] = currencyUsdCents as T[Extract<keyof T, string>];
			}
		} else if (options?.dateTimeLocalFieldKeys?.includes(key)) {
			if (typeof value === 'string') {
				const isoDate = value ? new Date(value).toISOString() : '';
				transformedObj[key] = isoDate as T[Extract<keyof T, string>];
			} else {
				transformedObj[key] = null as T[Extract<keyof T, string>];
			}
		} else if (options?.floatingPointNumberFieldKeys?.includes(key)) {
			if (typeof value === 'number') {
				transformedObj[key] = value as T[Extract<keyof T, string>];
			} else if (value == null || value === '' || typeof value !== 'string') {
				transformedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const integer = parseFloat(value.replace(/[^0-9.-]/g, ''));
				transformedObj[key] = integer as T[Extract<keyof T, string>];
			}
		} else if (options?.integerFieldKeys?.includes(key)) {
			if (typeof value === 'number') {
				transformedObj[key] = value as T[Extract<keyof T, string>];
			} else if (value == null || value === '' || typeof value !== 'string') {
				transformedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const integer = parseInt(value.replace(/[^0-9-]/g, ''), 10);
				transformedObj[key] = integer as T[Extract<keyof T, string>];
			}
		} else if (options?.percentageFieldKeys?.includes(key)) {
			if (typeof value === 'number') {
				transformedObj[key] = value as T[Extract<keyof T, string>];
			} else if (value == null || value === '' || typeof value !== 'string') {
				transformedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const floatingPointNumber = getFloatingPointNumberFromPercentage(value);
				transformedObj[key] = floatingPointNumber as T[Extract<
					keyof T,
					string
				>];
			}
		} else if (options?.phoneNumberFieldKeys?.includes(key)) {
			if (typeof value === 'string') {
				const isoDate = value
					? getE164PhoneNumberFromFormattedPhoneNumber(value)
					: '';
				transformedObj[key] = isoDate as T[Extract<keyof T, string>];
			} else {
				transformedObj[key] = null as T[Extract<keyof T, string>];
			}
		} else {
			// Leave other properties as they are
			transformedObj[key] = value;
		}
	}

	return transformedObj;
};

function getFloatingPointNumberFromPercentage(value: string): number {
	// Remove commas and the percent symbol, then parse as a float
	const numericValue = parseFloat(value.replace(/,/g, '').replace('%', ''));

	// Divide by 100 to get the floating-point representation of the percentage
	return numericValue / 100;
}

function getE164PhoneNumberFromFormattedPhoneNumber(value: string): string {
	const formattedPhoneNumber = value.replace(/[^0-9+]/g, '');
	if (formattedPhoneNumber.startsWith('+')) {
		return formattedPhoneNumber;
	}

	return `+1${formattedPhoneNumber}`;
}
