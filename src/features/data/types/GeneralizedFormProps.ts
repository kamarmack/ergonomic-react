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
	getApiResourceSpec: (
		resourceName: TResourceName,
	) => GeneralizedApiResourceSpec;
	getCreateOperationMutationForResource: (
		resourceName: TResourceName,
	) => (
		options: UseMutationOptions<unknown, GeneralizedError>,
	) => UseMutationResult;
	getPageQueryHookForResource: (
		resourceName: string | null,
	) => (
		options: GeneralizedUseQueryPageProps<GeneralizedApiResource>,
	) => UseQueryResult<GeneralizedFirestoreCollectionPage, GeneralizedError>;
	getUpdateOperationMutationForResource: (
		resourceName: TResourceName,
	) => (
		options: UseMutationOptions<unknown, GeneralizedError>,
	) => UseMutationResult;
	idPrefixByResourceName: Record<TResourceName, string>;
	onMutationSuccess: () => Promise<void>;
	operation: 'create' | 'update';
	resourceName: TResourceName;
	updateProps: {
		documentId: string;
		initialFieldValues: TFieldValues;
	} | null;
};
