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
	TCollection extends string = string,
> = {
	_object: TCollection;
	control: Control<TFieldValues, unknown>;
	fieldErrors: GeneralizedFormFieldErrors<TFieldValues>;
	fieldKey: Path<TFieldValues>;
	fieldSpec: GeneralizedFieldSpec;
	getPageQueryHookForCollection: (
		collectionId: string | null,
	) => (
		options: GeneralizedUseQueryPageProps<GeneralizedApiResource>,
	) => UseQueryResult<GeneralizedFirestoreCollectionPage, GeneralizedError>;
	idPrefixByCollection: Record<TCollection, string>;
	initialFormData: FieldValues | null;
	isSubmitting: boolean;
	operation: 'create' | 'update';
	setError: (message: string) => void;
};
