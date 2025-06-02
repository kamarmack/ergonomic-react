import { FiRefreshCw } from 'react-icons/fi';
import { FieldValues, useController } from 'react-hook-form';
import { getDocumentIdString } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';

/**
 * DocumentIDField component renders an input field with a button to generate a new unique document ID.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<T>} props - The properties for configuring the component.
 * @param {TResourceName} props._object - Specifies the resource name.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage the form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {Record<TResourceName, string>} props.idPrefixByResourceName - A map of document ID prefixes for each resource name.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered DocumentIDField component, with an input and button for changing the document ID.
 *
 * @description
 * The `DocumentIDField` component integrates with `react-hook-form` to manage an input field
 * for a document ID, and includes a button to regenerate a unique document ID based on the provided
 * document type. This component supports form validation and disabled states while maintaining
 * compatibility with form submissions.
 */
export const DocumentIDField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	_object,
	className = '',
	control,
	disabled,
	fieldKey: name,
	idPrefixByResourceName,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| '_object'
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldKey'
	| 'idPrefixByResourceName'
	| 'operation'
>): JSX.Element => {
	const { field } = useController({
		control,
		disabled: disabled || operation === 'update',
		name,
	});
	const generateNewDocumentId = () =>
		field.onChange(
			getDocumentIdString({
				id_prefix: idPrefixByResourceName[_object],
			}),
		);

	return (
		<div className='relative'>
			<Input
				{...field}
				className={cn('block w-full p-2 border rounded-md bg-white', className)}
			/>
			{operation === 'create' && (
				<button
					className='absolute right-0 -top-5 flex items-center space-x-1.5 text-sm'
					disabled={disabled}
					onClick={generateNewDocumentId}
					type='button'
				>
					<div>
						<p>New</p>
					</div>
					<div>
						<FiRefreshCw />
					</div>
				</button>
			)}
		</div>
	);
};
