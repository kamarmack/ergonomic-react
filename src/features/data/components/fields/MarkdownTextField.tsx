import * as R from 'ramda';
import { useEffect, useMemo, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * MarkdownTextField component renders a markdown editor
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
 * @returns {JSX.Element} The rendered MarkdownTextField component, a markdown editor for entering extended text.
 *
 * @description
 * The `MarkdownTextField` component integrates with `react-hook-form` to manage a markdown editor for capturing
 * extended text entries. The component disables input while the form is submitting. It is suitable for multiline
 * or lengthy text inputs with markdown formatting.
 */
export const MarkdownTextField = <
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
	| 'language'
	| 'operation'
>): JSX.Element => {
	// Markdown editor variables
	const [markdown, setMarkdown] = useState<string | null>(null);
	const isMarkdownLoading = markdown == null;
	const MarkdownEditor = useMemo(
		() => dynamic(() => import('@uiw/react-md-editor'), { ssr: false }),
		[],
	);

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});

	// Initialize markdown value
	useEffect(() => {
		if (isMarkdownLoading) {
			setMarkdown(
				operation === 'create'
					? fieldSpec?.default ?? ''
					: R.pathOr<string>('', [name], initialFormData),
			);
		}
	}, [operation, fieldSpec?.default, isMarkdownLoading, name, initialFormData]);

	// Sync markdown value with form state
	useEffect(() => {
		if (typeof markdown === 'string') {
			field.onChange(markdown);
		}
	}, [field.onChange, markdown]);

	// Suspense loading state
	if (isMarkdownLoading)
		return (
			<div className='flex items-center space-x-2'>
				<Skeleton className='flex-1 h-28' />
			</div>
		);

	return (
		<MarkdownEditor
			className={className}
			onChange={(value, _viewUpdate) => {
				if (disabled) {
					return;
				}
				setMarkdown(value ?? '');
			}}
			value={markdown}
		/>
	);
};
