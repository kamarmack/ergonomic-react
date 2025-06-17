import 'react-quill/dist/quill.snow.css';
import * as R from 'ramda';
import { useEffect, useMemo, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * RichTextField component renders a rich text editor
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
 * @returns {JSX.Element} The rendered RichTextField component, a rich text editor for entering extended text.
 *
 * @description
 * The `RichTextField` component integrates with `react-hook-form` to manage a rich text editor for capturing
 * extended text entries. The component disables input while the form is submitting. It is suitable for multiline
 * or lengthy text inputs with rich text formatting.
 */
export const RichTextField = <
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
	// Rich text editor variables
	const [richText, setRichText] = useState<string | null>(null);
	const isRichTextLoading = richText == null;
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[],
	);

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const { language } = useLanguage(baseTranslations);
	const placeholder = getPlaceholder(
		language,
		name,
		fieldSpec,
		'Enter text here...',
	);

	// Initialize rich text
	useEffect(() => {
		if (operation !== 'create') return;
		if (isRichTextLoading) {
			setRichText(
				operation === 'create'
					? fieldSpec?.default ?? ''
					: R.pathOr<string>('', [name], initialFormData),
			);
		}
	}, [operation, fieldSpec?.default, isRichTextLoading, name, initialFormData]);

	// Sync rich text value with form state
	useEffect(() => {
		if (typeof richText === 'string') {
			field.onChange(richText);
		}
	}, [field.onChange, richText]);

	// Suspense loading state
	if (isRichTextLoading)
		return (
			<div className='flex items-center space-x-2'>
				<Skeleton className='flex-1 h-28' />
			</div>
		);

	return (
		<ReactQuill
			className={className}
			onChange={(v) => {
				if (disabled) {
					return;
				}
				setRichText(v);
			}}
			placeholder={placeholder}
			theme='snow'
			value={richText}
		/>
	);
};
