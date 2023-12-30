import {
	DefaultOptions,
	QueryClient,
	QueryObserverResult,
	UseQueryOptions,
} from '@tanstack/react-query';
import { BaseApiObject } from 'ergonomic';
import { FirestoreCollectionQueryOptions } from '../features/data/types/FirestoreQueryTypes';
import { GeneralizedFirestoreCollectionPage } from '../features/data/utils/generalizedFirestoreCollectionPageQuery';
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

export type GeneralizedUseQueryKeyFn<T extends BaseApiObject> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [T['_object'], string];

export type GeneralizedUseQueryPageOptions<T extends BaseApiObject> = Omit<
	UseQueryOptions<
		GeneralizedFirestoreCollectionPage<T>,
		ApiRequestError,
		GeneralizedFirestoreCollectionPage<T>,
		ReturnType<GeneralizedUseQueryKeyFn<T>>
	>,
	'queryFn' | 'queryKey'
>;

export type GeneralizedUseQueryPageProps<T extends BaseApiObject> = {
	firestoreQueryOptions: FirestoreCollectionQueryOptions;
	reactQueryOptions?: GeneralizedUseQueryPageOptions<T>;
};

export type GeneralizedUseQueryPageObserver<T extends BaseApiObject> =
	QueryObserverResult<GeneralizedFirestoreCollectionPage<T>, ApiRequestError>;
