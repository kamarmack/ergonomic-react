import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired, UsaStateCodeEnum } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * AddressField component renders an input field or a dropdown selection based on the field type,
 * specifically supporting address line 1, address line 2, city, state, country, and postal code fields within a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` for managing form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The name of the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default values.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered AddressField component, with dropdowns for states and countries
 * or an input field for other address-related fields.
 *
 * @description
 * The `AddressField` component provides specialized form field handling for address data within
 * a form using `react-hook-form`. Depending on the field's key, it dynamically renders a dropdown
 * for US states or countries or an input field for other address parts.
 */
export const AddressField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	language,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'language'
	| 'operation'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const { language: fallbackLanguage } = useLanguage(baseTranslations);
	const placeholder = getPlaceholder(
		language || fallbackLanguage,
		name,
		fieldSpec,
	);

	if (name.endsWith('state')) {
		return (
			<select
				{...field}
				className={cn('block border p-2 rounded-md w-full', className)}
				required={required}
			>
				<option disabled value=''>
					{
						{ en: 'Select one', es: 'Selecciona una opción' }[
							language || fallbackLanguage
						]
					}
				</option>
				{UsaStateCodeEnum.arr.map((state) => (
					<option key={state} value={state}>
						{state}
					</option>
				))}
			</select>
		);
	}

	if (name.endsWith('country')) {
		return (
			<select
				{...field}
				className={cn('block border p-2 rounded-md w-full', className)}
				required={required}
			>
				<option disabled value=''>
					{
						{ en: 'Select one', es: 'Selecciona una opción' }[
							language || fallbackLanguage
						]
					}
				</option>
				{['US'].map((option) => {
					return (
						<option key={option} value={option}>
							{option}
						</option>
					);
				})}
			</select>
		);
	}

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			placeholder={placeholder}
			required={required}
		/>
	);
};
