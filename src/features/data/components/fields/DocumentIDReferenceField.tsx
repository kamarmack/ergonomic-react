import * as R from 'ramda';
import * as changeCase from 'change-case';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { isFieldRequired } from 'ergonomic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { default as cn } from '../../../../lib/cn';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';

/**
 * DocumentIDReferenceField component renders a selector for referencing document IDs for a specific resource,
 * supporting multiple data types and multi-selection.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field.
 * @param {Record<string, string>} props.idPrefixByResourceName - Map of resource names to their document ID prefixes.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered DocumentIDReferenceField component, which is a selector for document ID references.
 *
 * @description
 * The `DocumentIDReferenceField` component integrates with `react-hook-form` to manage a selection field that allows
 * users to reference document IDs from other resources. Depending on the `fieldSpec` metadata, it can support multiple
 * reference resources and enable multi-selection for ID references. If multiple reference resources are specified,
 * a resource name selector appears for filtering document options. The component handles loading states with skeletons and
 * dynamically sets whether the field is required based on `fieldSpec` and `operation`.
 */
export const DocumentIDReferenceField = <
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
>({
	className = '',
	control,
	fieldKey: name,
	fieldSpec,
	getPageQueryHookForResource,
	idPrefixByResourceName,
	initialFormData,
	isSubmitting,
	operation,
}: Pick<
	GeneralizedFormFieldProps<TFieldValues, TResourceName>,
	| 'className'
	| 'control'
	| 'fieldKey'
	| 'fieldSpec'
	| 'getPageQueryHookForResource'
	| 'idPrefixByResourceName'
	| 'initialFormData'
	| 'isSubmitting'
	| 'operation'
>): JSX.Element => {
	// Field variables
	const { resources = [], type } = fieldSpec?.meta || {};
	const disabled = isSubmitting;
	const isMulti = type === 'foreign_keys';
	const acceptsMultipleDataTypes = resources.length > 1;
	const required = isFieldRequired({ fieldSpec, operation });

	// Reference resource query logic
	const [resourceNameForReference, setResourceNameIdForReference] =
		useState<TResourceName | null>((resources as TResourceName[])[0] ?? null);
	const isPageQueryForReferenceResourceEnabled =
		resourceNameForReference != null &&
		!!idPrefixByResourceName[resourceNameForReference];
	const pageQueryHookForResource = getPageQueryHookForResource(
		resourceNameForReference as
			| Parameters<typeof getPageQueryHookForResource>[0]
			| null,
	);
	const { data: documentPageData, isLoading: isDocumentPageDataLoading } =
		pageQueryHookForResource({
			firestoreQueryOptions: { pageSize: 300 },
			reactQueryOptions: { enabled: isPageQueryForReferenceResourceEnabled },
		});
	const documentPage = documentPageData?.documents ?? [];
	const documentPageOptions = (
		isMulti ? [] : [{ label: 'None', value: '' }]
	).concat(
		documentPage.map(({ _id, name }) => ({
			label: name || _id,
			value: _id,
		})),
	);

	// Initial value
	const [initialValue, setInitialValue] = useState<
		| { label: string; value: string }
		| { label: string; value: string }[]
		| null
		| undefined
	>(null);
	const isInitialValueReady = !(initialValue === null);
	useEffect(() => {
		if (isInitialValueReady) return;
		if (operation === 'create') {
			setInitialValue(isMulti ? [] : undefined);
			return;
		}

		if (isDocumentPageDataLoading) return;
		if (initialFormData == null) {
			setInitialValue(isMulti ? [] : undefined);
			return;
		}

		const value = R.pathOr<string | { id: string; value: string }[] | null>(
			null,
			[name],
			initialFormData,
		);
		if (value == null) {
			setInitialValue(isMulti ? [] : undefined);
			return;
		}

		if (isMulti) {
			const valuesAsArray = (Array.isArray(value) ? value : [value]) as {
				id: string;
				value: string;
			}[];
			const matches = documentPage.filter(({ _id }) =>
				valuesAsArray.some((arrayValue) => arrayValue.value === _id),
			);
			setInitialValue(() =>
				matches.map(({ _id, name }) => ({
					label: name || _id,
					value: _id,
				})),
			);
			return;
		}

		const valuesAsString = (Array.isArray(value) ? value[0] : value) as string;
		if (!valuesAsString) {
			setInitialValue(undefined);
			return;
		}

		const match = documentPage.find(({ _id }) => _id === valuesAsString);
		if (!match) {
			setInitialValue(undefined);
			return;
		}

		setInitialValue(() => ({
			label: match.name || match._id,
			value: valuesAsString,
		}));
	}, [
		isMulti,
		isInitialValueReady,
		isDocumentPageDataLoading,
		documentPage,
		name,
		operation,
		initialFormData,
	]);

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});

	// Suspense loading state
	const isDocumentIDReferenceFieldLoading =
		isDocumentPageDataLoading || !isInitialValueReady;
	if (isDocumentIDReferenceFieldLoading) {
		return (
			<div>
				{Array.from({ length: 1 }).map(() => (
					<Skeleton className='h-8' />
				))}
			</div>
		);
	}

	return (
		<div className={cn('flex items-start space-x-2 w-full', className)}>
			{/* Resource selector (not present if there is only one option in `resources`) */}
			{acceptsMultipleDataTypes && (
				<div className='flex-1'>
					<div>
						<p>Resource Type</p>
					</div>
					<select
						className='block w-full p-2 border rounded-md bg-white'
						defaultValue={resourceNameForReference ?? ''}
						disabled={disabled}
						onChange={(e) =>
							setResourceNameIdForReference(e.target.value as TResourceName)
						}
					>
						<option disabled value=''>
							Select one
						</option>
						{resources.map((option) => {
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
					defaultValue={initialValue}
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
