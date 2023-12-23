import { type WhereFilterOp, type DocumentReference } from 'firebase/firestore';

export type FirestoreCollectionQueryOrderByClause = [string, 'asc' | 'desc'];
export type FirestoreCollectionQueryWhereClause = [
	string,
	WhereFilterOp,
	string | number | boolean | null,
];
export type FirestoreCollectionQueryOptions = {
	orderByClauses?: FirestoreCollectionQueryOrderByClause[];
	pageSize?: number;
	startAfterDocumentId?: string;
	startAfterDocumentReference?: DocumentReference;
	whereClauses?: FirestoreCollectionQueryWhereClause[];
};