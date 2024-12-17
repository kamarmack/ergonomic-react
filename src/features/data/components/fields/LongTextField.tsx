import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Textarea } from '../../../../components/ui/textarea';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldLabel as getLabel } from '../../utils/getGeneralizedFormFieldLabel';

/**
 * LongTextField component renders a textarea input field for handling long text values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered LongTextField component, a textarea input for entering long text.
 *
 * @description
 * The `LongTextField` component integrates with `react-hook-form` to manage a textarea input for capturing
 * extended text entries. The component dynamically sets the required attribute based on `fieldSpec` and
 * `operation`, and disables input while the form is submitting. It is suitable for multiline or lengthy text inputs.
 */
export const LongTextField = <
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

	return <Textarea {...field} placeholder={label} required={required} />;
};
