import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { BaseApiObject } from 'ergonomic';
import { FirestoreCollectionQueryOptions } from '../features/data/types/FirestoreQueryTypes';

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

export type GenericQueryKeyFn<T extends BaseApiObject> = (
	params: FirestoreCollectionQueryOptions,
) => readonly [T['_object'], string];
