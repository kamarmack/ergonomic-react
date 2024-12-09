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
	GeneralizedResponse,
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

export type GeneralizedUseQueryKeyFn<T extends GeneralizedApiResource> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [T['_object'], string];

export type GeneralizedUseQueryPageOptions<T extends GeneralizedApiResource> =
	Omit<
		UseQueryOptions<
			GeneralizedFirestoreCollectionPage<T>,
			GeneralizedError,
			GeneralizedFirestoreCollectionPage<T>,
			ReturnType<GeneralizedUseQueryKeyFn<T>>
		>,
		'queryFn' | 'queryKey'
	>;

export type GeneralizedUseQueryPageProps<T extends GeneralizedApiResource> = {
	firestoreQueryOptions: FirestoreCollectionQueryOptions;
	reactQueryOptions?: GeneralizedUseQueryPageOptions<T>;
};

export type GeneralizedUseQueryOptionsFn<T extends GeneralizedApiResource> = (
	props: GeneralizedUseQueryPageProps<T>,
) => UseQueryOptions<
	GeneralizedFirestoreCollectionPage<T>,
	GeneralizedError,
	GeneralizedFirestoreCollectionPage<T>,
	ReturnType<GeneralizedUseQueryKeyFn<T>>
>;

export type GeneralizedUseQueryPageObserver<T extends GeneralizedApiResource> =
	QueryObserverResult<GeneralizedFirestoreCollectionPage<T>, GeneralizedError>;

// Writes

export type GeneralizedUseCreateDocumentsMutationOptions<
	T extends GeneralizedApiResource,
	U extends GeneralizedCreateBody,
> = UseMutationOptions<GeneralizedResponse<T>, GeneralizedResponse<T>, U | U[]>;

export type GeneralizedUseUpdateDocumentsMutationOptions<
	T extends GeneralizedApiResource,
	U extends GeneralizedUpdateBody,
> = UseMutationOptions<
	unknown,
	GeneralizedResponse<T>,
	(U & { _id: string }) | (U & { _id: string })[]
>;
