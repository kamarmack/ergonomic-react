import * as yup from 'yup';
import { FieldValues } from 'react-hook-form';
import { useCallback } from 'react';
import {
	getFormDataConversionOptions,
	FormDataConversionOptions,
} from 'ergonomic';
import { convertFormDataToServerData } from '../utils/convertFormDataToServerData';

/**
 * Custom hook to use Yup as a resolver for React Hook Form
 *
 * Source – https://react-hook-form.com/advanced-usage#CustomHookwithResolver
 *
 * @param validationSchema - Yup schema to use for validation
 * @param options - Additional options
 * @param options.currencyFieldKeys - Field keys that represent currency fields
 * @param options.dateTimeLocalFieldKeys - Field keys that represent date-time fields
 * @param options.floatingPointNumberFieldKeys - Field keys that represent floating point number fields
 * @param options.integerFieldKeys - Field keys that represent integer fields
 * @param options.percentageFieldKeys - Field keys that represent percentage fields
 * @param options.phoneNumberFieldKeys - Field keys that represent phone number fields
 * @returns Resolver function for React Hook Form
 *
 * @example
 * const validationSchema = yup.object().shape({
 *  name: yup.string().required(),
 * 	age: yup.number().positive().integer().required(),
 * });
 * const resolver = useYupValidationResolver(validationSchema);
 * const { handleSubmit } = useForm({ resolver });
 *
 */
export const useYupValidationResolver = <T extends FieldValues>(
	validationSchema: yup.ObjectSchema<T> | null,
	options: FormDataConversionOptions = getFormDataConversionOptions(),
	verbose = false,
) =>
	useCallback(
		async (formData: FieldValues) => {
			const serverData = convertFormDataToServerData(formData, options);

			if (!validationSchema) {
				verbose &&
					console.warn('No validation schema provided, skipping validation');

				return {
					values: serverData,
					errors: {},
				};
			}

			try {
				const values = await validationSchema.validate(serverData, {
					abortEarly: false,
				});

				verbose && console.log('Validation success:', values);

				return {
					values,
					errors: {},
				};
			} catch (err) {
				const errors = err as yup.ValidationError;

				verbose &&
					console.error('Validation error:', {
						inner: errors.inner,
						formData,
						serverData,
					});

				return {
					values: {},
					errors: errors.inner.reduce(
						(allErrors, currentError) => ({
							...allErrors,
							[currentError?.path ?? 'root']: {
								type: currentError.type ?? 'validation',
								message: currentError.message,
							},
						}),
						{},
					),
				};
			}
		},
		[validationSchema],
	);
