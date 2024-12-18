import React from 'react';
import { BaseComponent } from '../../../types/BaseComponentTypes';
import { getGeneralizedFormFieldPresentation as getFieldPresentation } from '../utils/getGeneralizedFormFieldPresentation';

export type GeneralizedFormFieldErrorProps = BaseComponent & {
	fieldErrorMessage: string;
};
export const GeneralizedFormFieldError: React.FC<
	GeneralizedFormFieldErrorProps
> = ({ className = '', fieldErrorMessage }) => {
	const fieldPresentation = getFieldPresentation(fieldErrorMessage);

	if (fieldPresentation === 'normal') return null;

	return (
		<div className={className}>
			<p className='font-semibold text-red-700 text-xs'>
				{fieldErrorMessage.toString()}
			</p>
		</div>
	);
};
