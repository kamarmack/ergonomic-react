import React from 'react';
import { FieldValues } from 'react-hook-form';
import { default as cn } from '../../../lib/cn';
import { GeneralizedFormFieldProps } from '../types/GeneralizedFormFieldProps';
import { GeneralizedFormFieldLabel } from './GeneralizedFormFieldLabel';
import { GeneralizedFormField } from './GeneralizedFormField';
import { GeneralizedFormFieldError } from './GeneralizedFormFieldError';

export const GeneralizedFormFieldContainer = <
	T extends FieldValues = FieldValues,
>({
	_object,
	control,
	fieldErrors,
	fieldKey,
	fieldSpec,
	getPageQueryHookForResource,
	hideRequiredIndicator,
	idPrefixByResourceName,
	initialFormData,
	isSubmitting,
	operation,
	setError,
}: GeneralizedFormFieldProps<T>): JSX.Element => {
	const { type } = fieldSpec?.meta || {};
	const fieldErrorMessage = (fieldErrors[fieldKey]?.message ?? '').toString();

	return (
		<div className='mt-3'>
			<div className={cn(type === 'boolean' ? 'flex' : '')}>
				<div className={cn(type === 'boolean' ? 'hidden' : '')}>
					<GeneralizedFormFieldLabel
						fieldKey={fieldKey}
						fieldSpec={fieldSpec}
						hideRequiredIndicator={hideRequiredIndicator}
						operation={operation}
					/>
				</div>
				<div>
					<GeneralizedFormField
						_object={_object}
						control={control}
						idPrefixByResourceName={idPrefixByResourceName}
						fieldErrors={fieldErrors}
						fieldKey={fieldKey}
						fieldSpec={fieldSpec}
						getPageQueryHookForResource={getPageQueryHookForResource}
						initialFormData={initialFormData}
						isSubmitting={isSubmitting}
						operation={operation}
						setError={setError}
					/>
				</div>
				<div className={cn(type === 'boolean' ? 'ml-2' : 'hidden')}>
					<GeneralizedFormFieldLabel
						fieldKey={fieldKey}
						fieldSpec={fieldSpec}
						operation={operation}
					/>
				</div>
			</div>
			<div>
				<GeneralizedFormFieldError
					className='my-1'
					fieldErrorMessage={fieldErrorMessage}
				/>
			</div>
		</div>
	);
};
