import * as R from 'ramda';
import { FieldValues, Path, PathValue, useController } from 'react-hook-form';
import { IanaTimeZoneEnum, isFieldRequired } from 'ergonomic';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
	getLabelByOption,
} from '../../../../hooks/useLocalization';

/**
 * TimeZoneField component renders a dropdown for selecting a single option from the list of IANA time zones,
 * with options labeled based on field specifications.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Specifications for the field, including allowed options and labels.
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
	disabled,
	fieldKey: name,
	fieldSpec,
	initialFormData,
	language,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'initialFormData'
	| 'language'
	| 'operation'
>): JSX.Element => {
	const { label_by_enum_option = {} } = fieldSpec?.meta || {};
	const { language: fallbackLanguage } = useLanguage(baseTranslations);
	const labelByOption = getLabelByOption(
		language || fallbackLanguage,
		label_by_enum_option,
	);
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
				{
					{ en: 'Select one', es: 'Selecciona una opción' }[
						language || fallbackLanguage
					]
				}
			</option>
			{options.map((option) => (
				<option key={option} value={option}>
					{labelByOption[option] ?? option}
				</option>
			))}
		</select>
	);
};
