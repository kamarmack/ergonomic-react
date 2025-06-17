import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Textarea } from '../../../../components/ui/textarea';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * LongTextField component renders a textarea input field for handling long text values in a form.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules.
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
	className = '',
	control,
	disabled,
	fieldKey: name,
	fieldSpec,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	'className' | 'control' | 'disabled' | 'fieldKey' | 'fieldSpec' | 'operation'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });
	const { language } = useLanguage(baseTranslations);
	const placeholder = getPlaceholder(language, name, fieldSpec);

	return (
		<Textarea
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			placeholder={placeholder}
			required={required}
		/>
	);
};
