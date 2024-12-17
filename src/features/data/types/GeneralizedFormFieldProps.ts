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
	control: Control<TFieldValues, unknown>;
	fieldErrors: GeneralizedFormFieldErrors<TFieldValues>;
	fieldKey: Path<TFieldValues>;
	fieldSpec: GeneralizedFieldSpec;
	getPageQueryHookForCollection: (
		collectionId: string | null,
	) => (
		options: GeneralizedUseQueryPageProps<GeneralizedApiResource>,
	) => UseQueryResult<GeneralizedFirestoreCollectionPage, GeneralizedError>;
	idPrefixByCollection: Record<TResourceName, string>;
	initialFormData: FieldValues | null;
	isSubmitting: boolean;
	operation: 'create' | 'update';
	setError: (message: string) => void;
};
