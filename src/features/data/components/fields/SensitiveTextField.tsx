import { isFieldRequired } from 'ergonomic';
import { FieldValues, useController } from 'react-hook-form';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * SensitiveTextField component renders a password input field for handling sensitive text values.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Specifications for the field, including validation rules.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered SensitiveTextField component, an input field for password or sensitive text.
 *
 * @description
 * The `SensitiveTextField` component integrates with `react-hook-form` to manage a password input field,
 * suitable for capturing sensitive text entries such as passwords. The component sets the required attribute
 * dynamically based on `fieldSpec` and `operation`, and disables input during form submission. It displays
 * a placeholder of obscured characters for added security.
 */
export const SensitiveTextField = <
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
	const placeholder = getPlaceholder(language, name, fieldSpec, '•••••••••••');

	return (
		<Input
			{...field}
			className={cn('block w-full p-2 border rounded-md bg-white', className)}
			placeholder={placeholder}
			required={required}
			type='password'
		/>
	);
};
