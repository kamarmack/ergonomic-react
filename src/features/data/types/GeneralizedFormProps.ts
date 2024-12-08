import {
	GeneralizedApiResource,
	GeneralizedApiResourceSpec,
	GeneralizedResponse,
} from 'ergonomic';
import {
	UseMutationOptions,
	UseMutationResult,
	UseQueryResult,
} from '@tanstack/react-query';
import { FieldValues } from 'react-hook-form';
import { GeneralizedUseQueryPageProps } from '../../../lib/tanstackQuery';
import { GeneralizedFirestoreCollectionPage } from '../utils/generalizedFirestoreCollectionPageQuery';

export type GeneralizedFormProps<
	TFieldValues extends FieldValues = FieldValues,
	TCollection extends string = string,
> = {
	collectionId: TCollection;
	getApiResourceSpec: (collectionId: TCollection) => GeneralizedApiResourceSpec;
	getCreateOperationMutationForCollection: (
		collectionId: TCollection,
	) => (
		options: UseMutationOptions<unknown, GeneralizedResponse>,
	) => UseMutationResult;
	getPageQueryHookForCollection: (
		collectionId: string | null,
	) => (
		options: GeneralizedUseQueryPageProps<GeneralizedApiResource>,
	) => UseQueryResult<GeneralizedFirestoreCollectionPage, GeneralizedResponse>;
	getUpdateOperationMutationForCollection: (
		collectionId: TCollection,
	) => (
		options: UseMutationOptions<unknown, GeneralizedResponse>,
	) => UseMutationResult;
	idPrefixByCollection: Record<TCollection, string>;
	onMutationSuccess: () => Promise<void>;
	operation: 'create' | 'update';
	updateProps: {
		documentId: string;
		initialFieldValues: TFieldValues;
	} | null;
};
