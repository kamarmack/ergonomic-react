import {
	DefaultOptions,
	QueryClient,
	QueryObserverResult,
	UseQueryOptions,
	UseMutationOptions,
} from '@tanstack/react-query';
import {
	GeneralizedApiObject,
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

export type GeneralizedUseQueryKeyFn<T extends GeneralizedApiObject> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [T['_object'], string];

export type GeneralizedUseQueryPageOptions<T extends GeneralizedApiObject> =
	Omit<
		UseQueryOptions<
			GeneralizedFirestoreCollectionPage<T>,
			GeneralizedError,
			GeneralizedFirestoreCollectionPage<T>,
			ReturnType<GeneralizedUseQueryKeyFn<T>>
		>,
		'queryFn' | 'queryKey'
	>;

export type GeneralizedUseQueryPageProps<T extends GeneralizedApiObject> = {
	firestoreQueryOptions: FirestoreCollectionQueryOptions;
	reactQueryOptions?: GeneralizedUseQueryPageOptions<T>;
};

export type GeneralizedUseQueryOptionsFn<T extends GeneralizedApiObject> = (
	props: GeneralizedUseQueryPageProps<T>,
) => UseQueryOptions<
	GeneralizedFirestoreCollectionPage<T>,
	GeneralizedError,
	GeneralizedFirestoreCollectionPage<T>,
	ReturnType<GeneralizedUseQueryKeyFn<T>>
>;

export type GeneralizedUseQueryPageObserver<T extends GeneralizedApiObject> =
	QueryObserverResult<GeneralizedFirestoreCollectionPage<T>, GeneralizedError>;

// Writes

export type GeneralizedUseCreateDocumentsMutationOptions<
	T extends GeneralizedApiObject,
	U extends GeneralizedCreateBody,
> = UseMutationOptions<GeneralizedResponse<T>, GeneralizedResponse<T>, U | U[]>;

export type GeneralizedUseUpdateDocumentsMutationOptions<
	T extends GeneralizedApiObject,
	U extends GeneralizedUpdateBody,
> = UseMutationOptions<
	unknown,
	GeneralizedResponse<T>,
	(U & { _id: string }) | (U & { _id: string })[]
>;
