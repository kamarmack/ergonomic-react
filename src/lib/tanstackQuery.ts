import {
	DefaultOptions,
	QueryClient,
	QueryObserverResult,
	UseQueryOptions,
} from '@tanstack/react-query';
import { GeneralizedApiObject, GeneralizedError } from 'ergonomic';
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

export type GeneralizedUseQueryPageObserver<T extends GeneralizedApiObject> =
	QueryObserverResult<GeneralizedFirestoreCollectionPage<T>, GeneralizedError>;
