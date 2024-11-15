import * as R from 'ramda';
import * as changeCase from 'change-case';
import { v4 } from 'uuid';
import { useState } from 'react';
import Select from 'react-select';
import { isFieldRequired } from 'ergonomic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { default as cn } from '../../../../lib/cn';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * DocumentIDReferenceField component renders a selector for referencing document IDs within a specific collection,
 * supporting multiple data types and multi-selection.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as meta information about reference collections.
 * @param {Record<string, string>} props.idPrefixByCollection - Map of collection IDs to their document ID prefixes.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered DocumentIDReferenceField component, which is a selector for document ID references.
 *
 * @description
 * The `DocumentIDReferenceField` component integrates with `react-hook-form` to manage a selection field that allows
 * users to reference document IDs from other collections. Depending on the `fieldSpec` metadata, it can support multiple
 * reference collections and enable multi-selection for ID references. If multiple reference collections are specified,
 * a collection selector appears for filtering document options. The component handles loading states with skeletons and
 * dynamically sets whether the field is required based on `fieldSpec` and `operation`.
 */
export const DocumentIDReferenceField = <
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
>({
	control,
	fieldKey: name,
	fieldSpec,
	getPageQueryHookForCollection,
	idPrefixByCollection,
	isSubmitting,
	operation,
}: GeneralizedFormFieldProps<TFieldValues, TCollection>): JSX.Element => {
	// Field variables
	const { reference_collections = [], type } = fieldSpec?.meta || {};
	const disabled = isSubmitting;
	const isMulti = type === 'id_refs';
	const acceptsMultipleDataTypes = reference_collections.length > 1;
	const required = isFieldRequired({ fieldSpec, operation });
	const initialValue = [] as string[];

	// Reference collection query logic
	const [collectionIdForReference, setCollectionIdForReference] =
		useState<TCollection | null>(
			(reference_collections as TCollection[])[0] ?? null,
		);
	const isPageQueryForReferenceCollectionEnabled =
		collectionIdForReference != null &&
		!!idPrefixByCollection[collectionIdForReference];
	const pageQueryHookForCollection = getPageQueryHookForCollection(
		collectionIdForReference,
	);
	const { data: documentPageData, isLoading: isDocumentPageDataLoading } =
		pageQueryHookForCollection({
			firestoreQueryOptions: { pageSize: 300 },
			reactQueryOptions: { enabled: isPageQueryForReferenceCollectionEnabled },
		});
	const documentPage = documentPageData?.documents ?? [];
	const documentPageOptions = (
		isMulti ? [] : [{ label: 'None', value: '' } as unknown as string]
	).concat(
		documentPage.map(
			({ _id, name }) =>
				({
					label: name,
					value: _id,
				} as unknown as string),
		),
	);

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});

	// Suspense loading state
	if (isDocumentPageDataLoading) {
		return (
			<div>
				{Array.from({ length: 1 }).map(() => (
					<Skeleton className='h-8' />
				))}
			</div>
		);
	}

	return (
		<div className='flex items-start space-x-2 w-full'>
			{/* Collection selector (not present if there is only one option in `reference_collections`) */}
			{acceptsMultipleDataTypes && (
				<div className='flex-1'>
					<div>
						<p>Data Type</p>
					</div>
					<select
						className='block w-full p-2 border rounded-md bg-white'
						defaultValue={collectionIdForReference ?? ''}
						disabled={disabled}
						onChange={(e) =>
							setCollectionIdForReference(e.target.value as TCollection)
						}
					>
						<option disabled value=''>
							Select one
						</option>
						{reference_collections.map((option) => {
							return (
								<option key={option} value={option}>
									{changeCase.sentenceCase(option)}
								</option>
							);
						})}
					</select>
				</div>
			)}

			{/* Document selector */}
			<div
				className={cn(acceptsMultipleDataTypes ? 'flex-[4_4_0%]' : 'flex-1')}
			>
				{acceptsMultipleDataTypes && (
					<div>
						<p>Selection</p>
					</div>
				)}
				<Select
					defaultValue={
						operation === 'create' ? ([] as string[]) : initialValue
					}
					isDisabled={field.disabled}
					isMulti={isMulti}
					name={field.name}
					onChange={(changedValues = []) => {
						const value = isMulti
							? // values is an array { value: string }[]
							  (changedValues as unknown as { value: string }[]).map(
									(data) => ({ ...R.pick(['value'], data), id: v4() }),
							  )
							: // values is a single { value: string } or null
							  (changedValues as unknown as { value: string })?.value;
						console.log('Value changed to:', value);
						field.onChange(value);
					}}
					options={documentPageOptions}
					required={!isMulti && required}
				/>
			</div>
		</div>
	);
};
