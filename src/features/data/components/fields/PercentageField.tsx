import * as R from 'ramda';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldLabel as getLabel } from '../../utils/getGeneralizedFormFieldLabel';
import { handlePercentageFieldKeyUp } from '../../utils/handlePercentageFieldKeyUp';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * PercentageField component renders an input field for handling percentage values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid domain input.
 *
 * @returns {JSX.Element} The rendered PercentageField component, an input field for entering floating-point
 * numbers which are formatted as percentages, e.g. 0.1 to represent 10%.
 *
 * @description
 * The `PercentageField` component integrates with `react-hook-form` to manage an input field for percentages.
 * It automatically sets the `required` attribute based on `fieldSpec` and `operation`, and disables the input
 * field when the form is submitting. The component enforces numeric input, suitable for capturing decimal values.
 */
export const PercentageField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	operation,
	setError,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'fieldSpec'
	| 'operation'
	| 'setError'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const { language } = useLanguage(baseTranslations);
	const label = getLabel(language, name, fieldSpec);

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			onKeyUp={handlePercentageFieldKeyUp({
				field: R.pick(['onChange'], field),
				setError,
			})}
			placeholder={label}
			required={required}
		/>
	);
};
