import React from 'react';
import { FieldValues } from 'react-hook-form';
import { default as cn } from '../../../lib/cn';
import { LiteFormFieldProps } from '../types/LiteFormFieldProps';
import { LiteFormFieldLabel } from './LiteFormFieldLabel';
import { LiteFormField } from './LiteFormField';
import { LiteFormFieldError } from './LiteFormFieldError';

export const LiteFormFieldContainer = <T extends FieldValues = FieldValues>({
	control,
	disabled,
	fieldErrors,
	fieldKey,
	fieldSpec,
	hideRequiredIndicator,
	initialFormData,
	operation,
	renderTooltipContent,
	setError,
}: LiteFormFieldProps<T>): JSX.Element => {
	const { type } = fieldSpec?.meta || {};
	const fieldErrorMessage = (fieldErrors[fieldKey]?.message ?? '').toString();

	return (
		<div className='mt-3'>
			<div className={cn(type === 'boolean' ? 'flex' : '')}>
				<div className={cn(type === 'boolean' ? 'hidden' : '')}>
					<LiteFormFieldLabel
						fieldKey={fieldKey}
						fieldSpec={fieldSpec}
						hideRequiredIndicator={hideRequiredIndicator}
						operation={operation}
						renderTooltipContent={renderTooltipContent}
					/>
				</div>
				<div>
					<LiteFormField
						control={control}
						disabled={disabled}
						fieldErrors={fieldErrors}
						fieldKey={fieldKey}
						fieldSpec={fieldSpec}
						initialFormData={initialFormData}
						operation={operation}
						setError={setError}
					/>
				</div>
				<div className={cn(type === 'boolean' ? 'ml-2' : 'hidden')}>
					<LiteFormFieldLabel
						fieldKey={fieldKey}
						fieldSpec={fieldSpec}
						operation={operation}
						renderTooltipContent={renderTooltipContent}
					/>
				</div>
			</div>
			<div>
				<LiteFormFieldError
					className='my-1'
					fieldErrorMessage={fieldErrorMessage}
				/>
			</div>
		</div>
	);
};
