import {
	type DocumentReference,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import { GeneralizedApiResource, GeneralizedApiResourceSpec } from 'ergonomic';
import {
	firebaseFirestoreInstance,
	handleFirestoreOperationError,
} from '../../../lib/firebase';
import { FirestoreCollectionQueryOptions } from '../types/FirestoreQueryTypes';
import { CastOptions } from 'yup/lib/schema';

export type GeneralizedFirestoreCollectionPage<
	T extends GeneralizedApiResource = GeneralizedApiResource,
> = {
	currentPageStartAfterDocumentReference: DocumentReference | null | undefined;
	documents: T[];
	nextPageStartAfterDocumentReference: DocumentReference | null | undefined;
};
export const defaultApiResourceCastOptions: CastOptions = {
	stripUnknown: true,
	assert: true,
};
export const generalizedFirestoreCollectionPageQuery =
	<T extends GeneralizedApiResource = GeneralizedApiResource>(
		apiResourceSpec: GeneralizedApiResourceSpec,
	) =>
	async (
		queryOptions: FirestoreCollectionQueryOptions,
		castOptions = defaultApiResourceCastOptions,
	): Promise<GeneralizedFirestoreCollectionPage<T>> => {
		try {
			const {
				orderByClauses = [],
				pageSize = null,
				startAfterDocumentReference = null,
				whereClauses = [],
			} = queryOptions;

			// Build the query
			let q = query(
				collection(firebaseFirestoreInstance, apiResourceSpec.collectionId),
			);

			// Apply where clauses
			whereClauses.forEach((clause) => {
				q = query(q, where(...clause));
			});

			// Apply orderBy clauses
			orderByClauses.forEach((clause) => {
				q = query(q, orderBy(...clause));
			});

			// Apply limit clause
			let pageSizePlus1 = -1;
			if (pageSize) {
				pageSizePlus1 = pageSize + 1;
				q = query(q, limit(pageSizePlus1));
			}

			// Apply startAfter clause
			if (startAfterDocumentReference) {
				q = query(q, startAfter(startAfterDocumentReference));
			}

			const querySnapshot = await getDocs(q);
			const allDocuments: T[] = querySnapshot.docs
				.map((doc): T | null => {
					const data = doc.data();
					try {
						return apiResourceSpec.apiResourceJsonSchema.cast(
							data,
							castOptions,
						) as T;
					} catch (err) {
						console.error(
							'ERROR: Detected data in the Firestore collection that does not conform to the schema.',
							{ data, err },
						);
						return null;
					}
				})
				.filter((data: T | null): data is T => data !== null);
			const hasMore = pageSize != null && allDocuments.length > pageSize;
			const documents = hasMore
				? allDocuments.slice(0, pageSize)
				: allDocuments;

			const nextPageStartAfterDocumentReference =
				hasMore && pageSize != null && documents.length > 0
					? querySnapshot.docs[pageSize - 1]?.ref
					: null;

			return {
				currentPageStartAfterDocumentReference: startAfterDocumentReference,
				documents,
				nextPageStartAfterDocumentReference,
			};
		} catch (error) {
			return handleFirestoreOperationError(error);
		}
	};
