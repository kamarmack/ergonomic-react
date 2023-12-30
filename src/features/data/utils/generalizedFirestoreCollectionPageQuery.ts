import {
	type DocumentReference,
	FirestoreError,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from 'firebase/firestore';
import { GeneralizedApiObject, getGeneralizedError } from 'ergonomic';
import { firebaseFirestoreInstance } from '../../../lib/firebase';
import { FirestoreCollectionQueryOptions } from '../types/FirestoreQueryTypes';

export type GeneralizedFirestoreCollectionPage<
	T extends GeneralizedApiObject = GeneralizedApiObject,
> = {
	currentPageStartAfterDocumentReference: DocumentReference | null | undefined;
	documents: T[];
	nextPageStartAfterDocumentReference: DocumentReference | null | undefined;
};

export const generalizedFirestoreCollectionPageQuery =
	<T extends GeneralizedApiObject = GeneralizedApiObject>(
		collectionId: string,
	) =>
	async (
		queryOptions: FirestoreCollectionQueryOptions,
	): Promise<GeneralizedFirestoreCollectionPage<T>> => {
		try {
			const {
				orderByClauses = [],
				pageSize = null,
				startAfterDocumentReference = null,
				whereClauses = [],
			} = queryOptions;

			if (
				whereClauses.some((whereClause) => {
					const [_fieldName, _operator, value] = whereClause;
					return typeof value === 'undefined';
				})
			) {
				// If any of the where clauses have an undefined value, return an empty page.
				// This typically happens when a query is being built and but the value for a where clause is not yet available.
				return {
					currentPageStartAfterDocumentReference: null,
					documents: [],
					nextPageStartAfterDocumentReference: null,
				};
			}

			// Build the query
			let q = query(collection(firebaseFirestoreInstance, collectionId));

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
			const allDocuments: T[] = querySnapshot.docs.map(
				(doc) => doc.data() as T,
			);
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
			if (error instanceof FirestoreError) {
				// Handle Firestore-specific errors
				const generalizedError = getGeneralizedError({
					category: 'request.unknown-error',
					data: { firestoreError: error },
					message: error.message,
					status_text: 'An unknown error occurred.',
				});
				console.error({ generalizedError });
				return Promise.reject(generalizedError);
			}
			const defaultError = getGeneralizedError();
			return Promise.reject(defaultError);
		}
	};
