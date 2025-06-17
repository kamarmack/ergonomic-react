// TODO: Implement logic for duration fields where `required` is true

import * as R from 'ramda';
import { Duration, DurationLikeObject } from 'luxon';
import { yupX } from 'ergonomic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { useEffect, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { default as cn } from '../../../../lib/cn';
import {
	baseTranslations,
	useLanguage,
} from '../../../../hooks/useLocalization';

/**
 * DurationField component renders a series of dropdown selectors to input a duration, divided into years, months,
 * weeks, days, and hours, supporting ISO 8601 duration format.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {boolean} props.disabled - Flag indicating whether or not to disable the input, e.g. during submission.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default duration value.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered DurationField component, which allows users to specify duration in years, months, weeks, days, and hours.
 *
 * @description
 * The `DurationField` component integrates with `react-hook-form` to manage an input field for specifying a duration.
 * Based on the `fieldSpec` and `operation`, it initializes the duration values from an ISO 8601 string or default value.
 * The duration is divided into years, months, weeks, days, and hours, each selectable from a dropdown. The component
 * synchronizes these values into an ISO duration string and disables input during form submission. If no initial value is
 * provided, the component defaults to zero values across all units.
 */
export const DurationField = <
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
	// Duration computation logic
	const [duration, setDuration] = useState<DurationLikeObject | null>(null);
	const isIsoDurationLoading = duration == null;
	const isEmptyDuration =
		isIsoDurationLoading || Object.values(duration).every((val) => val === 0);
	const isoDurationString = isEmptyDuration
		? ''
		: Duration.fromObject(duration).toISO();

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});
	const { language } = useLanguage(baseTranslations);

	// Initialize duration value
	useEffect(() => {
		if (!isIsoDurationLoading) return;

		let initialDuration: DurationLikeObject = {
			years: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
		};

		const defaultValueStringForCreateOperation =
			fieldSpec?.default?.toString() || '';
		const defaultValueStringForUpdateOperation = R.pathOr<string>(
			'',
			[name],
			initialFormData,
		);
		const defaultValueString =
			operation === 'create'
				? defaultValueStringForCreateOperation
				: defaultValueStringForUpdateOperation;
		const isDefaultValueStringAValidDuration =
			defaultValueString !== '' &&
			yupX.duration().isValidSync(defaultValueString);

		if (isDefaultValueStringAValidDuration) {
			const {
				years = 0,
				months = 0,
				weeks = 0,
				days = 0,
				hours = 0,
			} = Duration.fromISO(defaultValueString).toObject();
			initialDuration = {
				years,
				months,
				weeks,
				days,
				hours,
			};
		}

		setDuration(() => initialDuration);
	}, [
		operation,
		fieldSpec?.default,
		name,
		initialFormData,
		isIsoDurationLoading,
	]);

	// Sync duration value with form state
	useEffect(() => {
		if (typeof isoDurationString === 'string') {
			field.onChange(isoDurationString);
		}
	}, [field.onChange, isoDurationString]);

	// Suspense loading state
	if (isIsoDurationLoading)
		return (
			<div className='flex items-center space-x-2'>
				{Array.from({ length: 5 }).map(() => (
					<Skeleton className='flex-1 h-8' />
				))}
			</div>
		);

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			{[
				{
					defaultValue: duration?.years,
					length: 31,
					setValue: (value: number) =>
						setDuration((prev) => ({ ...(prev ?? {}), years: value })),
					title: 'Years',
				},
				{
					defaultValue: duration?.months,
					length: 12,
					setValue: (value: number) =>
						setDuration((prev) => ({ ...(prev ?? {}), months: value })),
					title: 'Months',
				},
				{
					defaultValue: duration?.weeks,
					length: 5,
					setValue: (value: number) =>
						setDuration((prev) => ({ ...(prev ?? {}), weeks: value })),
					title: 'Weeks',
				},
				{
					defaultValue: duration?.days,
					length: 7,
					setValue: (value: number) =>
						setDuration((prev) => ({ ...(prev ?? {}), days: value })),
					title: 'Days',
				},
				{
					defaultValue: duration?.hours,
					length: 24,
					setValue: (value: number) =>
						setDuration((prev) => ({ ...(prev ?? {}), hours: value })),
					title: 'Hours',
				},
			].map(({ defaultValue, length, setValue, title }) => (
				<div key={title} className='flex-1'>
					<p>{title}</p>
					<select
						className='block w-full p-2 border rounded-md bg-white'
						defaultValue={defaultValue ? defaultValue.toString() : ''}
						disabled={field.disabled}
						onChange={(e) => {
							setValue(parseInt(e.target.value, 10));
						}}
					>
						<option disabled value=''>
							{{ en: 'Select one', es: 'Selecciona una opción' }[language]}
						</option>
						{Array.from({ length }, (_, i) => i.toString()).map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			))}
		</div>
	);
};
