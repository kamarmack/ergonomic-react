import * as R from 'ramda';
import { FieldValues, useController } from 'react-hook-form';
import { isFieldRequired } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { handleUrlFieldBlur } from '../../utils/handleUrlFieldBlur';

/**
 * UrlField component renders an input field for handling URL values, with optional guidance for file storage paths.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Specifications for the field, including metadata for guidance on file paths.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 * @param {function} props.setError - Function to set custom error messages for invalid URL input.
 *
 * @returns {JSX.Element} The rendered UrlField component, an input field for URL entries.
 *
 * @description
 * The `UrlField` component integrates with `react-hook-form` to manage a URL input field. It optionally provides
 * guidance text for file paths if the field type is designated as a "file". The input validates URL formatting on blur
 * using `handleUrlFieldBlur` and provides error feedback if the URL is invalid. The component dynamically sets the
 * required attribute based on `fieldSpec` and `operation`, and disables input during form submission.
 */
export const UrlField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	fieldKey: name,
	fieldSpec,
	isSubmitting,
	operation,
	setError,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'control'
	| 'fieldKey'
	| 'fieldSpec'
	| 'isSubmitting'
	| 'operation'
	| 'setError'
>): JSX.Element => {
	const disabled = isSubmitting;
	const { type } = fieldSpec?.meta || {};
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const required = isFieldRequired({ fieldSpec, operation });

	return (
		<div>
			{type === 'file' && (
				<p className='text-sm text-gray-500'>
					Enter the Cloud Storage Path for the file, e.g.{' '}
					<span className='text-blue-500 font-mono text-xs'>
						gs://my-bucket/my-file.jpg
					</span>
				</p>
			)}
			<Input
				{...field}
				onBlur={handleUrlFieldBlur({
					field: R.pick(['onBlur'], field),
					setError,
				})}
				placeholder='https://example.com'
				required={required}
			/>
		</div>
	);
};
