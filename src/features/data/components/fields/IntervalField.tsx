import * as R from 'ramda';
import { useEffect, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { getDateWithMinutePrecision, yupX } from 'ergonomic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import cn from '../../../../lib/cn';

/**
 * IntervalField component renders a pair of date-time input fields for specifying a start and end date-time,
 * representing an interval with ISO 8601 formatting.
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TResourceName - TResourceName parameter is a string union of the API resource names.
 * @param {GeneralizedFormFieldProps<TFieldValues, TResourceName>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default interval values.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered IntervalField component, which allows users to specify a start and end date-time for an interval.
 *
 * @description
 * The `IntervalField` component integrates with `react-hook-form` to manage an interval input, represented by
 * a start and end date-time in ISO 8601 format. The component initializes the interval based on `fieldSpec`
 * if provided or sets default empty values. It synchronizes these values with the form state, allowing the
 * interval to be stored as a combined ISO string (e.g., 'startDate/endDate'). During form submission, the component
 * is disabled, and a loading state is displayed initially with skeleton placeholders.
 */
export const IntervalField = <
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
	// Interval computation logic
	const [interval, setInterval] = useState<IntervalLikeObject | null>(null);
	const isIsoIntervalLoading = interval == null;
	const isoIntervalString = isIsoIntervalLoading
		? null
		: interval?.start && interval?.end
		? `${interval.start}/${interval.end}`
		: '';

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});

	// Initialize interval value
	useEffect(() => {
		if (!isIsoIntervalLoading) return;

		let initialInterval: IntervalLikeObject = { start: '', end: '' };

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
		const isDefaultValueStringAValidInterval =
			defaultValueString !== '' &&
			yupX.interval().isValidSync(defaultValueString);

		if (isDefaultValueStringAValidInterval) {
			const [start, end] = defaultValueString.split('/') as [string, string];
			initialInterval = { start, end };
		}

		setInterval(() => initialInterval);
	}, [
		operation,
		fieldSpec?.default,
		isIsoIntervalLoading,
		name,
		initialFormData,
	]);

	// Sync interval value with form state
	useEffect(() => {
		if (typeof isoIntervalString === 'string' && isoIntervalString) {
			field.onChange(isoIntervalString);
		}
	}, [field.onChange, isoIntervalString]);

	// Suspense loading state
	if (isIsoIntervalLoading)
		return (
			<div className={cn('flex items-center space-x-2', className)}>
				{Array.from({ length: 2 }).map(() => (
					<Skeleton className='flex-1 h-8' />
				))}
			</div>
		);

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			{[
				{
					label: 'Start Date',
					value: interval?.start ?? '',
					onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
						field.onBlur();
						const dateString = e.target.value;
						const date = dateString ? new Date(dateString).toISOString() : '';
						setInterval((prev) => ({ ...(prev ?? {}), start: date }));
					},
				},
				{
					label: 'End Date',
					value: interval?.end ?? '',
					onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
						field.onBlur();
						const dateString = e.target.value;
						const date = dateString ? new Date(dateString).toISOString() : '';
						setInterval((prev) => ({ ...(prev ?? {}), end: date }));
					},
				},
			].map(({ label, value, onBlur }, index) => (
				<div className='flex-1' key={index}>
					<p>{label}</p>
					<Input
						defaultValue={getDateWithMinutePrecision(value)}
						disabled={disabled}
						type='datetime-local'
						onBlur={onBlur}
					/>
				</div>
			))}
		</div>
	);
};

type IntervalLikeObject = {
	start?: string;
	end?: string;
};
