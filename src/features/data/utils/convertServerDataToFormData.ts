// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type convertFormDataToServerData } from './convertFormDataToServerData';

import { v4 } from 'uuid';
import {
	FormDataConversionOptions,
	getCurrencyUsdStringFromCents,
	getDateWithMinutePrecision,
	getFormDataConversionOptions,
	getPercentageFromFloatingPointNumber,
	getHumanFriendlyPhoneNumber,
} from 'ergonomic';

/**
 * Transforms form data from the server into a format compatible with React Hook Form, handling both string arrays and currency fields.
 *
 * React Hook Form requires arrays to be in a specific format, where each item is an object with "id" and "value" properties rather than simple strings. This function converts string arrays accordingly. Additionally, specified fields representing values that need special handling, such as currency fields, are transformed into a more user-friendly format.
 *
 * This function is the inverse of {@link convertFormDataToServerData}.
 *
 * @param obj - The server data object to be transformed.
 * @param options - An object containing options for the transformation.
 * @param options.currencyFieldKeys - An array of keys representing fields that should be treated as currency values.
 * @param options.dateTimeLocalFieldKeys - An array of keys representing fields that should be treated as date-time-local values.
 * @param options.floatingPointNumberFieldKeys - An array of keys representing fields that should be treated as floating point number values.
 * @param options.integerFieldKeys - An array of keys representing fields that should be treated as integer values.
 * @param options.percentageFieldKeys - An array of keys representing fields that should be treated as percentage values.
 * @param options.phoneNumberFieldKeys - An array of keys representing fields that should be treated as phone number values.
 * @returns The transformed form data object, suitable for use with React Hook Form.
 *
 * @example
 * ```typescript
 * const serverData = {
 *   name: 'John Doe',
 *   height: 183,
 *   hobbies: ['Reading', 'Swimming', 'Cycling'],
 *   salary: 25000000, // in cents
 * 	 date_of_birth: '1962-01-01T00:00:00.000Z',
 * 	 weight: 81646.6, // in grams
 * 	 num_followers: 1548,
 * 	 interest_rate: 0.05,
 * 	 cell_number: '+14155552671,
 * };
 * const formData = convertServerDataToFormData(
 * 	serverData,
 * 	{
 * 		currencyFieldKeys: ['salary'],
 * 		dateTimeLocalFieldKeys: ['date_of_birth'],
 * 		floatingPointNumberFieldKeys: ['weight'],
 * 		integerFieldKeys: ['num_followers'],
 * 		percentageFieldKeys: ['interest_rate'],
 * 		phoneNumberFieldKeys: ['cell_number'],
 * 	},
 * );
 * // => {
 * //   name: 'John Doe',
 * //   height: 183,
 * //   hobbies: [
 * //     { value: 'Reading', id: '1' },
 * //     { value: 'Swimming', id: '2' },
 * //     { value: 'Cycling', id: '3' },
 * //   ],
 * //   salary: '$250,000.00' // formatted USD string
 * // 	date_of_birth: '1961-12-31T19:00', // UTC-5 offset in yyyy-MM-ddTHH:mm format
 * // 	weight: '81,646.6',
 * // 	num_followers: '1,548',
 * // 	interest_rate: '5%',
 * // 	cell_number: '(415) 555-2671', // NOTE: This does *not* include the country code
 * // }
 * ```
 */
export const convertServerDataToFormData = <T extends Record<string, unknown>>(
	obj: T,
	options: FormDataConversionOptions = getFormDataConversionOptions(),
): T => {
	const populatedObj = {} as T;

	for (const key in obj) {
		const value = obj[key];
		if (
			Array.isArray(value) &&
			value.every((item: unknown) => typeof item === 'string')
		) {
			// Transform arrays of strings into arrays of objects with "id" and "value" properties
			populatedObj[key] = value.map((str: string) => ({
				id: v4(), // Generate a unique ID for each entry
				value: str,
			})) as T[Extract<keyof T, string>];
		} else if (options?.currencyFieldKeys?.includes(key)) {
			if (value == null || typeof value !== 'number' || isNaN(value)) {
				populatedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const cents = Number(value);
				const currencyUsdString = getCurrencyUsdStringFromCents(cents);
				populatedObj[key] = currencyUsdString as T[Extract<keyof T, string>];
			}
		} else if (options?.dateTimeLocalFieldKeys?.includes(key)) {
			if (typeof value === 'string') {
				const localDateTime = getDateWithMinutePrecision(value);
				populatedObj[key] = localDateTime as T[Extract<keyof T, string>];
			} else {
				populatedObj[key] = null as T[Extract<keyof T, string>];
			}
		} else if (
			options?.floatingPointNumberFieldKeys?.includes(key) ||
			options?.integerFieldKeys?.includes(key)
		) {
			if (value == null || typeof value !== 'number' || isNaN(value)) {
				populatedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const formattedValue = new Intl.NumberFormat(undefined, {
					maximumFractionDigits: 10,
				}).format(value);
				populatedObj[key] = formattedValue as T[Extract<keyof T, string>];
			}
		} else if (options?.percentageFieldKeys?.includes(key)) {
			if (value == null || typeof value !== 'number' || isNaN(value)) {
				populatedObj[key] = null as T[Extract<keyof T, string>];
			} else {
				const formattedValue = getPercentageFromFloatingPointNumber(value);
				populatedObj[key] = formattedValue as T[Extract<keyof T, string>];
			}
		} else if (options?.phoneNumberFieldKeys?.includes(key)) {
			if (typeof value === 'string') {
				const formattedPhoneNumber = value
					? getHumanFriendlyPhoneNumber(value, 'national')
					: '';
				populatedObj[key] = formattedPhoneNumber as T[Extract<keyof T, string>];
			} else {
				populatedObj[key] = null as T[Extract<keyof T, string>];
			}
		} else {
			// Leave other properties as they are
			populatedObj[key] = value;
		}
	}

	return populatedObj;
};
