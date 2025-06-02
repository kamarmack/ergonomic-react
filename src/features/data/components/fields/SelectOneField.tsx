import * as R from 'ramda';
import * as changeCase from 'change-case';
import { FieldValues, Path, PathValue, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';

/**
 * SelectOneField component renders a dropdown for selecting a single option from a predefined list,
 * with options labeled based on field specifications.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
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
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	initialFormData,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'initialFormData'
	| 'operation'
>): JSX.Element => {
	const { label_by_enum_option = {} } = fieldSpec?.meta || {};
	const options = fieldSpec.oneOf;
	const defaultValueFromSpec = fieldSpec.default?.toString();
	const defaultValue = (
		operation === 'create'
			? defaultValueFromSpec && options.includes(defaultValueFromSpec)
				? defaultValueFromSpec
				: ''
			: R.pathOr<string | null>('', [name], initialFormData) ?? ''
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
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
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
