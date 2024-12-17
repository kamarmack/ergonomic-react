import {
	GeneralizedApiResource,
	GeneralizedApiResourceSpec,
	GeneralizedError,
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
	TResourceName extends string = string,
> = {
	collectionId: TResourceName;
	getApiResourceSpec: (
		collectionId: TResourceName,
	) => GeneralizedApiResourceSpec;
	getCreateOperationMutationForCollection: (
		collectionId: TResourceName,
	) => (
		options: UseMutationOptions<unknown, GeneralizedError>,
	) => UseMutationResult;
	getPageQueryHookForCollection: (
		collectionId: string | null,
	) => (
		options: GeneralizedUseQueryPageProps<GeneralizedApiResource>,
	) => UseQueryResult<GeneralizedFirestoreCollectionPage, GeneralizedError>;
	getUpdateOperationMutationForCollection: (
		collectionId: TResourceName,
	) => (
		options: UseMutationOptions<unknown, GeneralizedError>,
	) => UseMutationResult;
	idPrefixByCollection: Record<TResourceName, string>;
	onMutationSuccess: () => Promise<void>;
	operation: 'create' | 'update';
	updateProps: {
		documentId: string;
		initialFieldValues: TFieldValues;
	} | null;
};
