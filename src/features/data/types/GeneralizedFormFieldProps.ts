import {
	GeneralizedApiResource,
	GeneralizedError,
	GeneralizedFieldSpec,
} from 'ergonomic';
import { UseQueryResult } from '@tanstack/react-query';
import { Control, FieldValues, Path } from 'react-hook-form';
import { GeneralizedFormFieldErrors } from './GeneralizedFormFieldErrors';
import { GeneralizedUseQueryPageProps } from '../../../lib/tanstackQuery';
import { GeneralizedFirestoreCollectionPage } from '../utils/generalizedFirestoreCollectionPageQuery';

export type GeneralizedFormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TResourceName extends string = string,
> = {
	_object: TResourceName;
	className?: string;
	control: Control<TFieldValues, unknown>;
	fieldErrors: GeneralizedFormFieldErrors<TFieldValues>;
	fieldKey: Path<TFieldValues>;
	fieldSpec: GeneralizedFieldSpec;
	getPageQueryHookForResource: (
		resourceName: string | null,
	) => (
		options: GeneralizedUseQueryPageProps<GeneralizedApiResource>,
	) => UseQueryResult<GeneralizedFirestoreCollectionPage, GeneralizedError>;
	hideRequiredIndicator?: boolean;
	idPrefixByResourceName: Record<TResourceName, string>;
	initialFormData: FieldValues | null;
	isSubmitting: boolean;
	operation: 'create' | 'update';
	setError: (message: string) => void;
};
