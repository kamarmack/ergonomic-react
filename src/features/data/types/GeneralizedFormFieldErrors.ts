import { FieldErrors, FieldValues } from 'react-hook-form';

export type GeneralizedFormFieldErrors<T extends FieldValues = FieldValues> =
	FieldErrors<T> & {
		general?: {
			message: string;
			type: string;
		};
	};
