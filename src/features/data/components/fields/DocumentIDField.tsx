import { FiRefreshCw } from 'react-icons/fi';
import { FieldValues, useController } from 'react-hook-form';
import { getDocumentIdString } from 'ergonomic';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * DocumentIDField component renders an input field with a button to generate a new unique document ID.
 *
 * @template TFieldValues - The shape of the form field values extending from FieldValues.
 * @template TCollection - The string type comprising all possible collection names.
 * @param {GeneralizedFormFieldProps<T>} props - The properties for configuring the component.
 * @param {TCollection} props._object - Specifies the collection.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage the form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {Record<TCollection, string>} props.idPrefixByCollection - A map of document ID prefixes for each collection.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
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
	TCollection extends string = string,
>({
	_object,
	control,
	fieldKey: name,
	idPrefixByCollection,
	isSubmitting,
	operation,
}: GeneralizedFormFieldProps<TFieldValues, TCollection>): JSX.Element => {
	const disabled = isSubmitting || operation === 'update';
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const generateNewDocumentId = () =>
		field.onChange(
			getDocumentIdString({
				id_prefix: idPrefixByCollection[_object],
			}),
		);

	return (
		<div className='relative'>
			<Input {...field} />
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
