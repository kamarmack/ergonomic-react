import * as R from 'ramda';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldLabel as getLabel } from '../../utils/getGeneralizedFormFieldLabel';
import { handlePercentageFieldKeyUp } from '../../utils/handlePercentageFieldKeyUp';

/**
 * PercentageField component renders an input field for handling percentage values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
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
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
	setError,
}: GeneralizedFormFieldProps<TFieldValues, TResourceName>): JSX.Element => {
	const disabled = isSubmitting;
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const label = getLabel(name, fieldSpec);

	return (
		<Input
			{...field}
			onKeyUp={handlePercentageFieldKeyUp({
				field: R.pick(['onChange'], field),
				setError,
			})}
			placeholder={label}
			required={required}
		/>
	);
};
