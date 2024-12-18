import React from 'react';
import {
	GeneralizedFormFieldErrorProps,
	GeneralizedFormFieldError,
} from './GeneralizedFormFieldError';

export type LiteFormFieldErrorProps = GeneralizedFormFieldErrorProps;
export const LiteFormFieldError: React.FC<LiteFormFieldErrorProps> = (
	props,
) => {
	return <GeneralizedFormFieldError {...props} />;
};
