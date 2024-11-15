import React from 'react';
import { BaseComponent } from '../../../types/BaseComponentTypes';
import { getGeneralizedFormFieldPresentation as getFieldPresentation } from '../utils/getGeneralizedFormFieldPresentation';

export const GeneralizedFormFieldError: React.FC<
	BaseComponent & {
		fieldErrorMessage: string;
	}
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
