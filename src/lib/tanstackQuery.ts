import {
	DefaultOptions,
	QueryClient,
	QueryObserverResult,
	UseQueryOptions,
	UseMutationOptions,
} from '@tanstack/react-query';
import {
	GeneralizedApiResource,
	GeneralizedError,
	GeneralizedCreateBody,
	GeneralizedUpdateBody,
} from 'ergonomic';
import { FirestoreCollectionQueryOptions } from '../features/data/types/FirestoreQueryTypes';
import { GeneralizedFirestoreCollectionPage } from '../features/data/utils/generalizedFirestoreCollectionPageQuery';

const defaultQueryClientOptions: DefaultOptions = {
	queries: {
		useErrorBoundary: false,
		refetchOnWindowFocus: false,
		retry: false,
	},
};

export const queryClient = new QueryClient({
	defaultOptions: defaultQueryClientOptions,
});

// Reads

export type GeneralizedUseQueryKeyFn<TData extends GeneralizedApiResource> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [TData['_object'], string];

export type GeneralizedUseQueryPageOptions<
	TData extends GeneralizedApiResource,
> = Omit<
	UseQueryOptions<
		GeneralizedFirestoreCollectionPage<TData>,
		GeneralizedError,
		GeneralizedFirestoreCollectionPage<TData>,
		ReturnType<GeneralizedUseQueryKeyFn<TData>>
	>,
	'queryFn' | 'queryKey'
>;

export type GeneralizedUseQueryPageProps<TData extends GeneralizedApiResource> =
	{
		firestoreQueryOptions: FirestoreCollectionQueryOptions;
		reactQueryOptions?: GeneralizedUseQueryPageOptions<TData>;
	};

export type GeneralizedUseQueryOptionsFn<TData extends GeneralizedApiResource> =
	(
		props: GeneralizedUseQueryPageProps<TData>,
	) => UseQueryOptions<
		GeneralizedFirestoreCollectionPage<TData>,
		GeneralizedError,
		GeneralizedFirestoreCollectionPage<TData>,
		ReturnType<GeneralizedUseQueryKeyFn<TData>>
	>;

export type GeneralizedUseQueryPageObserver<
	TData extends GeneralizedApiResource,
> = QueryObserverResult<
	GeneralizedFirestoreCollectionPage<TData>,
	GeneralizedError
>;

// Writes

export type GeneralizedUseCreateDocumentsMutationOptions<
	TData extends GeneralizedApiResource,
	TCreateParams extends GeneralizedCreateBody,
> = UseMutationOptions<
	TData[],
	GeneralizedError,
	TCreateParams | TCreateParams[]
>;

export type GeneralizedUseUpdateDocumentsMutationOptions<
	TUpdateParams extends GeneralizedUpdateBody,
> = UseMutationOptions<
	unknown,
	GeneralizedError,
	(TUpdateParams & { _id: string }) | (TUpdateParams & { _id: string })[]
>;
