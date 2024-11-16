/*
	Example Recurrence Rule Strings supported by this component:
	FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36
	FREQ=MONTHLY;DTSTART=20221001T000000Z;UNTIL=20240524T000000Z
	FREQ=YEARLY;DTSTART=20230307T000000Z
	 */

import * as R from 'ramda';
import * as changeCase from 'change-case';
import { useEffect, useState } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import {
	RecurrenceRuleData,
	RecurrenceRuleFrequency,
	RecurrenceRuleFrequencyEnum,
	RecurrenceRuleEnding,
	RecurrenceRuleEndingEnum,
	YupHelpers,
	getRecurrenceRuleData,
	getRecurrenceRuleString,
} from 'ergonomic';
import { Skeleton } from '../../../../components/ui/skeleton';
import { Input } from '../../../../components/ui/input';
import { GeneralizedFormFieldProps } from '../../types/GeneralizedFormFieldProps';
import { getDefaultValueForDateFieldFromIsoStringWithMillisecondPrecision } from '../../utils/getDefaultValueForDateFieldFromIsoStringWithMillisecondPrecision';

const defaultRecurrenceRule: RecurrenceRuleData = {
	DTSTART: '',
	FREQ: 'YEARLY',
};

const getRecurrenceRuleFriendlyDateFromIsoDateString = (
	isoDateString: string,
) => {
	return (isoDateString.split('.')[0] ?? '').replace(/[:-]/g, '') + 'Z';
};

/**
 * RecurrenceRuleField component renders a form input for specifying recurrence rules,
 * including options for frequency, start date, and rule ending criteria (e.g., end date or occurrence count).
 *
 * Example Recurrence Rule Strings supported:
 * - FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36
 * - FREQ=MONTHLY;DTSTART=20221001T000000Z;UNTIL=20240524T000000Z
 * - FREQ=YEARLY;DTSTART=20230307T000000Z
 *
 * @template TFieldValues - The type representing all form field values.
 * @template TCollection - TCollection parameter is a string union of the Document Database Collection IDs.
 * @param {GeneralizedFormFieldProps<TFieldValues, TCollection>} props - The properties for configuring the component.
 * @param {unknown} props.control - The control object from `react-hook-form` used to manage form state.
 * @param {string} props.fieldKey - The key for identifying the form field, passed to `useController`.
 * @param {object} props.fieldSpec - Additional specifications for the field, such as default recurrence rule.
 * @param {boolean} props.isSubmitting - Flag indicating if the form is currently submitting, disabling inputs when true.
 * @param {string} props.operation - The operation type for the form, either 'create' or 'update'.
 *
 * @returns {JSX.Element} The rendered RecurrenceRuleField component, a form input for configuring recurrence rules.
 *
 * @description
 * The `RecurrenceRuleField` component integrates with `react-hook-form` to manage input for recurrence rules
 * in the iCalendar format. Users can specify a start date, frequency (e.g., daily, weekly, monthly, yearly),
 * and recurrence ending options (infinite, by date, or after a set number of occurrences). The component
 * handles ISO recurrence rule formatting and initialization from default values, updating form state based
 * on user input. During loading, a skeleton placeholder is displayed, and fields are disabled during form submission.
 */
export const RecurrenceRuleField = <
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
>({
	control,
	fieldKey: name,
	fieldSpec,
	initialFormData,
	isSubmitting,
	operation,
}: GeneralizedFormFieldProps<TFieldValues, TCollection>): JSX.Element => {
	// Field variables
	const disabled = isSubmitting;

	const [recurrenceRule, setRecurrenceRule] =
		useState<RecurrenceRuleData | null>(null);
	const [recurrenceRuleEnding, setRecurrenceRuleEnding] =
		useState<RecurrenceRuleEnding>('INFINITE');
	const isIsoRecurrenceRuleLoading = recurrenceRule == null;
	const isEmptyRecurrenceRule =
		isIsoRecurrenceRuleLoading || recurrenceRule.DTSTART === '';
	const isoRecurrenceRuleString = isEmptyRecurrenceRule
		? ''
		: getRecurrenceRuleString(recurrenceRule);

	// react-hook-form controller render props
	const { field } = useController({
		control,
		disabled,
		name,
	});

	// Create operation effect
	// Initialize recurrence rule value using fieldSpec?.default if the isIsoRecurrenceRuleLoading flag is true
	useEffect(() => {
		if (!isIsoRecurrenceRuleLoading) return;

		let initialRecurrenceRule = defaultRecurrenceRule;

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
		const isDefaultValueStringAValidRecurrenceRule =
			defaultValueString !== '' &&
			YupHelpers.recurrenceRule().isValidSync(defaultValueString);

		if (isDefaultValueStringAValidRecurrenceRule) {
			initialRecurrenceRule =
				getRecurrenceRuleData(defaultValueString) ?? defaultRecurrenceRule;
		}

		const initialRecurrenceRuleEnding =
			initialRecurrenceRule?.COUNT != null
				? 'COUNT'
				: initialRecurrenceRule?.UNTIL != null
				? 'UNTIL'
				: 'INFINITE';

		setRecurrenceRuleEnding(initialRecurrenceRuleEnding);
		setRecurrenceRule(() => initialRecurrenceRule);
	}, [
		operation,
		fieldSpec?.default,
		isIsoRecurrenceRuleLoading,
		name,
		initialFormData,
	]);

	// Sync recurrence rule value with form state
	useEffect(() => {
		if (typeof isoRecurrenceRuleString === 'string') {
			field.onChange(isoRecurrenceRuleString);
		}
	}, [field.onChange, isoRecurrenceRuleString]);

	// Suspense loading state
	if (isIsoRecurrenceRuleLoading)
		return (
			<div className='flex items-center space-x-2'>
				{Array.from({ length: 2 }).map(() => (
					<Skeleton className='flex-1 h-8' />
				))}
			</div>
		);

	return (
		<div>
			<div className='flex items-start space-x-2'>
				<div className='flex-1'>
					<p>Start Date</p>
					<Input
						defaultValue={getDefaultValueForDateFieldFromIsoStringWithMillisecondPrecision(
							recurrenceRule?.DTSTART?.slice(0, 8) ?? '',
						)}
						disabled={disabled}
						onBlur={(e) => {
							const dateString = e.target.value;

							if (!dateString) {
								setRecurrenceRule((prev) => ({
									...defaultRecurrenceRule,
									...(prev ?? {}),
									DTSTART: '',
								}));
								return;
							}

							const date = new Date(dateString).toISOString();
							const DTSTART =
								getRecurrenceRuleFriendlyDateFromIsoDateString(date);
							setRecurrenceRule((prev) => ({
								...defaultRecurrenceRule,
								...(prev ?? {}),
								DTSTART,
							}));
						}}
						type='datetime-local'
					/>
				</div>
				<div className=''>
					<p>Repeats</p>
					<select
						className='block w-full p-2 border rounded-md bg-white'
						defaultValue={recurrenceRule?.FREQ ?? 'YEARLY'}
						disabled={disabled}
						onChange={(e) => {
							const FREQ = e.target.value as RecurrenceRuleFrequency;
							setRecurrenceRule((prev) => ({
								...defaultRecurrenceRule,
								...(prev ?? {}),
								FREQ,
							}));
						}}
					>
						{RecurrenceRuleFrequencyEnum.arr.map((option) => {
							return (
								<option key={option} value={option}>
									{changeCase.sentenceCase(option)}
								</option>
							);
						})}
					</select>
				</div>
				<div className=''>
					<p>Ends</p>
					<select
						className='block w-full p-2 border rounded-md bg-white'
						defaultValue={recurrenceRuleEnding}
						disabled={disabled}
						onChange={(e) => {
							const prevEnding = recurrenceRuleEnding;
							const nextEnding = e.target.value as RecurrenceRuleEnding;

							if (nextEnding !== prevEnding) {
								if (nextEnding === 'INFINITE') {
									// remove count and until from recurrence rule
									setRecurrenceRule((prev) => {
										if (!prev) return defaultRecurrenceRule;

										const { COUNT: _count, UNTIL: _until, ...rest } = prev;
										return rest;
									});
								} else if (nextEnding === 'COUNT') {
									// set count to 1
									setRecurrenceRule((prev) => ({
										...defaultRecurrenceRule,
										...(prev ?? {}),
										COUNT: 1,
									}));
								} else if (nextEnding === 'UNTIL') {
									// set until to 1 year from now
									const date = new Date();
									date.setFullYear(date.getFullYear() + 1);
									const UNTIL = getRecurrenceRuleFriendlyDateFromIsoDateString(
										date.toISOString(),
									);
									setRecurrenceRule((prev) => ({
										...defaultRecurrenceRule,
										...(prev ?? {}),
										UNTIL,
									}));
								}
							}

							setRecurrenceRuleEnding(nextEnding);
						}}
					>
						{RecurrenceRuleEndingEnum.arr.map((option) => {
							return (
								<option key={option} value={option}>
									{
										{
											COUNT: 'After',
											INFINITE: 'Never',
											UNTIL: 'On',
										}[option]
									}
								</option>
							);
						})}
					</select>
				</div>
				{recurrenceRuleEnding === 'COUNT' && (
					<div className=''>
						<p>Occurrences</p>
						<Input
							defaultValue={
								typeof recurrenceRule?.COUNT === 'number'
									? recurrenceRule.COUNT.toString()
									: ''
							}
							disabled={disabled}
							onChange={(e) => {
								const count = parseInt(e.target.value, 10);
								setRecurrenceRule((prev) => ({
									...defaultRecurrenceRule,
									...(prev ?? {}),
									COUNT: count,
								}));
							}}
							step='1'
							type='number'
						/>
					</div>
				)}
				{recurrenceRuleEnding === 'UNTIL' && (
					<div className=''>
						<p>End Date</p>
						<Input
							defaultValue={getDefaultValueForDateFieldFromIsoStringWithMillisecondPrecision(
								recurrenceRule?.UNTIL?.slice(0, 8) ?? '',
							)}
							disabled={disabled}
							onBlur={(e) => {
								const dateString = e.target.value;

								if (!dateString) {
									setRecurrenceRule((prev) => ({
										...defaultRecurrenceRule,
										...(prev ?? {}),
										UNTIL: '',
									}));
									return;
								}

								const date = new Date(dateString).toISOString();
								const UNTIL =
									getRecurrenceRuleFriendlyDateFromIsoDateString(date);
								setRecurrenceRule((prev) => ({
									...defaultRecurrenceRule,
									...(prev ?? {}),
									UNTIL,
								}));
							}}
							type='datetime-local'
						/>
					</div>
				)}
			</div>
		</div>
	);
};
