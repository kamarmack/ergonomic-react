import * as changeCase from 'change-case';
import { FieldValues, Path, PathValue, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * SelectOneField component renders a dropdown for selecting a single option from a predefined list,
 * with options labeled based on field specifications.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Specifications for the field, including allowed options and labels.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered SelectOneField component, a dropdown for selecting a single option.
 *
 * @description
 * The `SelectOneField` component integrates with `react-hook-form` to manage a dropdown input for single selection.
 * Options for selection are derived from `fieldSpec.oneOf`, and each option label can be customized using
 * `label_by_enum_option` from the field's metadata. The component sets the required attribute based on `fieldSpec`
 * and `operation`, and disables input during form submission.
 */
export const SelectOneField = <
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
>({
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
}: GeneralizedFormFieldProps<TFieldValues, TCollection>): JSX.Element => {
	const disabled = isSubmitting;
	const { label_by_enum_option = {} } = fieldSpec?.meta || {};
	const options = fieldSpec.oneOf;
	const defaultValueFromSpec = fieldSpec.default?.toString();
	const defaultValue = (
		defaultValueFromSpec && options.includes(defaultValueFromSpec)
			? defaultValueFromSpec
			: ''
	) as PathValue<TFieldValues, Path<TFieldValues>>;
	const { field } = useController({
		control,
		defaultValue,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });

	return (
		<select
			{...field}
			className='block w-full p-2 border rounded-md bg-white'
			required={required}
		>
			<option disabled value=''>
				Select one
			</option>
			{options.map((option) => (
				<option key={option} value={option}>
					{label_by_enum_option[option] ?? changeCase.sentenceCase(option)}
				</option>
			))}
		</select>
	);
};
