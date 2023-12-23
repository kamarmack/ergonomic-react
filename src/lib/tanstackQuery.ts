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

export type GenericReactQueryKeyFn<T extends BaseApiObject> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [T['_object'], string];

export type GenericReactQueryPageOptions<T extends BaseApiObject> = Omit<
	UseQueryOptions<
		FirestoreCollectionPage<T>,
		ApiRequestError,
		FirestoreCollectionPage<T>,
		ReturnType<GenericReactQueryKeyFn<T>>
	>,
	'queryFn' | 'queryKey'
>;

export type GenericReactQueryPageProps<T extends BaseApiObject> = {
	firestoreQueryOptions: FirestoreCollectionQueryOptions;
	reactQueryOptions?: GenericReactQueryPageOptions<T>;
};

export type GenericReactQueryPageObserver<T extends BaseApiObject> =
	QueryObserverResult<FirestoreCollectionPage<T>, ApiRequestError>;
