import { FieldValues, FieldErrors } from 'react-hook-form';
import { GeneralizedFormFieldErrors } from '../types/GeneralizedFormFieldErrors';

/**
 * Helper function that adds a `general` key to the type of `FieldErrors`.
 *
 * This prevents the type error that occurs when reading the `general` key from `FieldErrors`.
 *
 * @param formState - The form state object.
 * @returns The form state object with the `general` key added to the type of `FieldErrors`.
 */
export const getGeneralizedFormFieldErrors = <
	T extends FieldValues,
>(formState: {
	errors: FieldErrors<T>;
}): GeneralizedFormFieldErrors<T> =>
	formState.errors as GeneralizedFormFieldErrors<T>;
