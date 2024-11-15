import * as yup from 'yup';
import { FieldValues } from 'react-hook-form';
import { useCallback } from 'react';
import { getGeneralizedServerDataFromFormData } from '../utils/getGeneralizedServerDataFromFormData';
import {
	defaultGeneralizedFormDataTransformationOptions,
	GeneralizedFormDataTransformationOptions,
} from '../types/GeneralizedFormDataTransformationOptions';

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
	options: GeneralizedFormDataTransformationOptions = defaultGeneralizedFormDataTransformationOptions,
) =>
	useCallback(
		async (formData: FieldValues) => {
			const data = getGeneralizedServerDataFromFormData(formData, options);

			if (!validationSchema) {
				console.warn('No validation schema provided, skipping validation');

				return {
					values: data,
					errors: {},
				};
			}

			try {
				const values = await validationSchema.validate(data, {
					abortEarly: false,
				});

				console.log('Validation success:', values);

				return {
					values,
					errors: {},
				};
			} catch (err) {
				const errors = err as yup.ValidationError;

				console.error('Validation error:', { inner: errors.inner, data });

				return {
					values: {},
					errors: errors.inner.reduce(
						(allErrors, currentError) => ({
							...allErrors,
							[currentError?.path ?? 'general']: {
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
