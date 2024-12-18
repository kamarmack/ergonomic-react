import * as R from 'ramda';
import { FieldValues, Path, PathValue, useController } from 'react-hook-form';
import { IanaTimeZoneEnum, isFieldRequired } from 'ergonomic';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';

/**
 * TimeZoneField component renders a dropdown for selecting a single option from the list of IANA time zones,
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
 * @returns {JSX.Element} The rendered TimeZoneField component, a dropdown for selecting a single IANA time zone.
 *
 * @description
 * The `TimeZoneField` component integrates with `react-hook-form` to manage a dropdown input for single selection.
 * Options for selection are derived from the list of IANA time zones, and each option label can be customized using
 * `label_by_enum_option` from the field's metadata. The component sets the required attribute based on `fieldSpec`
 * and `operation`, and disables input during form submission.
 */
export const TimeZoneField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	fieldKey: name,
	fieldSpec,
	initialFormData,
	isSubmitting,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'fieldKey'
	| 'fieldSpec'
	| 'initialFormData'
	| 'isSubmitting'
	| 'operation'
>): JSX.Element => {
	const disabled = isSubmitting;
	const { label_by_enum_option = {} } = fieldSpec?.meta || {};
	const options = IanaTimeZoneEnum.arr;
	const defaultValueFromSpec = fieldSpec.default?.toString();
	const defaultValue = (
		operation === 'create'
			? defaultValueFromSpec && IanaTimeZoneEnum.isMember(defaultValueFromSpec)
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
					{label_by_enum_option[option] ?? option}
				</option>
			))}
		</select>
	);
};
