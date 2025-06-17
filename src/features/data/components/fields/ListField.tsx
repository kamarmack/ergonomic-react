import { Input } from '../../../../components/ui/input';
import {
	Controller,
	FieldArray,
	FieldArrayPath,
	FieldValues,
	Path,
	useFieldArray,
} from 'react-hook-form';
import { v4 } from 'uuid';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldPlaceholder as getPlaceholder } from '../../utils/getGeneralizedFormFieldLabel';
import { GeneralizedFormFieldError } from '../GeneralizedFormFieldError';
import { GoPlus, GoXCircle } from 'react-icons/go';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * ListField component renders a dynamic list of input fields, allowing users to add or remove items,
 * suitable for managing lists within a form, such as file paths or simple text values.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {object} props.fieldErrors - Error messages for specific list items.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useFieldArray`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as validation rules or metadata.
 *
 * @returns {JSX.Element} The rendered ListField component, a list of input fields with add and remove functionality.
 *
 * @description
 * The `ListField` component integrates with `react-hook-form` to manage an array of input fields,
 * supporting dynamic addition and removal of list items. It uses `useFieldArray` for field management
 * and provides validation feedback through `GeneralizedFormFieldError` components. Each list item
 * can be removed individually, and a new item can be appended to the list. For file lists, it includes
 * specific guidance on entering Cloud Storage paths.
 */
export const ListField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	disabled,
	fieldErrors,
	fieldKey,
	fieldSpec,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'disabled'
	| 'fieldErrors'
	| 'fieldKey'
	| 'fieldSpec'
>): JSX.Element => {
	// Field variables
	const { type } = fieldSpec?.meta || {};
	const name = fieldKey as FieldArrayPath<TFieldValues>;

	// react-hook-form controller render props
	const { fields, append, remove } = useFieldArray<
		TFieldValues,
		FieldArrayPath<TFieldValues>,
		'id'
	>({
		control,
		name,
	});
	const handleAppend = () =>
		append({ id: v4(), value: '' } as FieldArray<
			TFieldValues,
			FieldArrayPath<TFieldValues>
		>);
	const { language } = useLanguage(baseTranslations);

	return (
		<div>
			{type === 'file_list' && (
				<p className='text-sm text-gray-500'>
					Enter the Cloud Storage Paths for the files, e.g.{' '}
					<span className='text-blue-500 font-mono text-xs'>
						gs://my-bucket/my-file.jpg
					</span>
				</p>
			)}

			{fields.map((field, index) => {
				const arrayItemError =
					(
						fieldErrors[`${name}[${index}]` as Path<TFieldValues>]?.message ??
						''
					)?.toString() ?? '';
				const handleRemoveArrayItem = () => remove(index);
				const placeholder = getPlaceholder(language, name, fieldSpec);

				return (
					<>
						<div className='flex items-center space-x-3' key={field.id}>
							<Controller
								control={control}
								disabled={disabled}
								name={`${name}.${index}.value` as Path<TFieldValues>}
								render={({ field: arrayItemField }) => (
									<Input
										{...arrayItemField}
										className={cn(
											'block w-full p-2 border rounded-md bg-white',
											className,
										)}
										placeholder={placeholder}
									/>
								)}
							/>
							<button
								className='flex items-center space-x-1.5 text-sm border rounded-md p-2'
								disabled={disabled}
								onClick={handleRemoveArrayItem}
								type='button'
							>
								<div>
									<GoXCircle className='text-red-800' />
								</div>
								<div>
									<p>Remove</p>
								</div>
							</button>
						</div>
						<GeneralizedFormFieldError fieldErrorMessage={arrayItemError} />
					</>
				);
			})}

			<button
				className='mt-2 flex items-center space-x-1.5 text-sm border rounded-md p-2'
				disabled={disabled}
				onClick={handleAppend}
				type='button'
			>
				<div>
					<GoPlus />
				</div>
				<div>
					<p>Add</p>
				</div>
			</button>
		</div>
	);
};
