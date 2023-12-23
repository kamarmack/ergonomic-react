import {
	DefaultOptions,
	QueryClient,
	QueryObserverResult,
	UseQueryOptions,
} from '@tanstack/react-query';
import { BaseApiObject } from 'ergonomic';
import { FirestoreCollectionQueryOptions } from '../features/data/types/FirestoreQueryTypes';
import { FirestoreCollectionPage } from '../features/data/utils/genericFirestoreCollectionPageQuery';
import { ApiRequestError } from './apiRequestError';

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

export type GenericUseQueryKeyFn<T extends BaseApiObject> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [T['_object'], string];

export type GenericUseQueryPageOptions<T extends BaseApiObject> = Omit<
	UseQueryOptions<
		FirestoreCollectionPage<T>,
		ApiRequestError,
		FirestoreCollectionPage<T>,
		ReturnType<GenericUseQueryKeyFn<T>>
	>,
	'queryFn' | 'queryKey'
>;

export type GenericUseQueryPageProps<T extends BaseApiObject> = {
	firestoreQueryOptions: FirestoreCollectionQueryOptions;
	reactQueryOptions?: GenericUseQueryPageOptions<T>;
};

export type GenericUseQueryPageObserver<T extends BaseApiObject> =
	QueryObserverResult<FirestoreCollectionPage<T>, ApiRequestError>;
