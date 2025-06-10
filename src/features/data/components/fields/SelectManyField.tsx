import * as R from 'ramda';
import * as changeCase from 'change-case';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFieldSpec } from 'ergonomic';
import { Skeleton } from '../../../../components/ui/skeleton';
import Select, { MultiValue } from 'react-select';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
	getLabelByOption,
} from '../../../../hooks/useLocalization';

type ReactSelectOption = { label: string; value: string };
const getOptionLabel = (
	option: string,
	language: 'en' | 'es',
	labelByEnumOption:
		| Record<'en' | 'es', Record<string, string>>
		| Record<string, string>,
) => {
	const labelByOption = getLabelByOption(language, labelByEnumOption);
	return labelByOption[option] ?? changeCase.sentenceCase(option);
};
const getOption =
	(
		language: 'en' | 'es',
		labelByEnumOption:
			| Record<'en' | 'es', Record<string, string>>
			| Record<string, string>,
	) =>
	(option: string): ReactSelectOption => ({
		label: getOptionLabel(option, language, labelByEnumOption),
		value: option,
	});

/**
 * SelectManyField component renders a multi-select dropdown using react-select, allowing users to select multiple options
 * from a predefined list, with options labeled based on field specifications.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as enum options and default selections.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered SelectManyField component, a multi-select dropdown for multiple selections.
 *
 * @description
 * The `SelectManyField` component integrates with `react-hook-form` to manage a multi-select dropdown field.
 * It loads selectable options from the `fieldSpec`, utilizing `react-select` for handling multi-selection.
 * Each option's label is customizable based on `label_by_enum_option`, and a set of default selections can be
 * initialized on component mount. When the form is submitting, the component is disabled, and a loading
 * skeleton is displayed until options are loaded.
 */
export const SelectManyField = <
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
	// Field variables
	const innerType = fieldSpec?.innerType ?? ({} as GeneralizedFieldSpec);
	const innerOneOf = innerType.oneOf ?? [];
	const innerMeta = innerType.meta ?? ({} as GeneralizedFieldSpec['meta']);
	const innerLabelByEnumOption = innerMeta?.label_by_enum_option ?? {};
	const { language } = useLanguage(baseTranslations);
	const options = innerOneOf.map(getOption(language, innerLabelByEnumOption));

	// Selections computation logic
	const [defaultSelections, setDefaultSelections] = useState<
		ReactSelectOption[] | null
	>(null);
	const isDefaultSelectionsLoading = defaultSelections == null;

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const handleReactSelectChange = (
		values: MultiValue<ReactSelectOption> = [],
	) => field.onChange(values.map(({ value }) => ({ id: v4(), value })));

	// Initialize defaultSelections value
	useEffect(() => {
		if (!isDefaultSelectionsLoading) return;

		const defaultValueForCreateOperations = fieldSpec?.default as unknown as
			| string[]
			| undefined;
		const defaultValueForUpdateOperations = R.pathOr<
			{ id: string; value: string }[]
		>([], [name], initialFormData);
		const selections = (
			operation === 'create'
				? Array.isArray(defaultValueForCreateOperations) &&
				  defaultValueForCreateOperations.every((s) => typeof s === 'string')
					? defaultValueForCreateOperations
					: []
				: defaultValueForUpdateOperations.map(({ value }) => value)
		).filter((s) => innerOneOf.includes(s));
		setDefaultSelections(() =>
			selections.map(getOption(language, innerLabelByEnumOption)),
		);
	}, [
		operation,
		fieldSpec?.default,
		isDefaultSelectionsLoading,
		name,
		initialFormData,
		language,
	]);

	// Suspense loading state
	if (isDefaultSelectionsLoading)
		return (
			<div className='flex items-center space-x-2'>
				<Skeleton className='flex-1 h-8' />
			</div>
		);

	return (
		<Select
			className={cn('block w-full rounded-md bg-white', className)}
			defaultValue={defaultSelections}
			isDisabled={field.disabled}
			isMulti
			name={name}
			options={options}
			onBlur={field.onBlur}
			onChange={handleReactSelectChange}
		/>
	);
};
