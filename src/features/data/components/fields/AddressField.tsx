import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired, UsaStateCodeEnum } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldLabel as getLabel } from '../../utils/getGeneralizedFormFieldLabel';

/**
 * AddressField component renders an input field or a dropdown selection based on the field type,
 * specifically supporting address line 1, address line 2, city, state, country, and postal code fields within a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - The collection name or identifier for namespacing form fields.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` for managing form state.
 * @param {string} props.fieldKey - The name of the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default values.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
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
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
}: GeneralizedFormFieldProps<TFieldValues, TResourceName>): JSX.Element => {
	const disabled = isSubmitting;
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const label = getLabel(name, fieldSpec);

	if (name.endsWith('state')) {
		return (
			<select
				{...field}
				className='block border p-2 rounded-md w-full'
				required={required}
			>
				<option disabled value=''>
					Select one
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
				className='block w-full p-2 border rounded-md bg-white'
				required={required}
			>
				<option disabled value=''>
					Select one
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

	return <Input {...field} placeholder={label} required={required} />;
};
