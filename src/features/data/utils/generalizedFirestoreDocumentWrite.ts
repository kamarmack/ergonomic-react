import { collection, doc, writeBatch } from 'firebase/firestore';
import {
	GeneralizedApiResource,
	GeneralizedApiResourceSpec,
	GeneralizedCreateBody,
	GeneralizedResponse,
	GeneralizedUpdateBody,
} from 'ergonomic';
import {
	firebaseFirestoreInstance,
	handleFirestoreOperationError,
} from '../../../lib/firebase';

// Maximum number of writes that can be batched together
const MAX_BATCH_SIZE = 490;

// Helper function to chunk the writes array
const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
};

export type FirestoreDocumentCreateParams<T extends GeneralizedCreateBody> =
	| T
	| T[];
export type FirestoreDocumentCreateResponse<T extends GeneralizedApiResource> =
	GeneralizedResponse<T>;
export const generalizedFirestoreDocumentCreateOperation =
	<T extends GeneralizedCreateBody, U extends GeneralizedApiResource>(
		collectionId: string,
		apiResourceSpec: GeneralizedApiResourceSpec,
	) =>
	async (
		params: FirestoreDocumentCreateParams<T>,
	): Promise<GeneralizedResponse<U>> => {
		try {
			// Setup response object
			const response: GeneralizedResponse<U> = {
				data: [],
				errors: [],
			};

			// Get the Firestore collection reference
			const collectionRef = collection(firebaseFirestoreInstance, collectionId);

			// Normalize to array for handling both single and batch writes
			const writes = Array.isArray(params) ? params : [params];
			const chunkedWrites = chunkArray(writes, MAX_BATCH_SIZE);

			// Perform batch writes
			for (const writeChunk of chunkedWrites) {
				const batch = writeBatch(firebaseFirestoreInstance);

				for (const createParams of writeChunk) {
					const documentData = apiResourceSpec.mergeCreateParams({
						createParams,
					}) as U;
					const documentRef = doc(collectionRef, documentData._id);
					batch.set(documentRef, documentData);
					response.data.push(documentData);
				}

				await batch.commit();
			}

			return response;
		} catch (error) {
			return handleFirestoreOperationError(error);
		}
	};

export type FirestoreDocumentUpdateParams<T extends GeneralizedUpdateBody> =
	| (T & { _id: string })
	| (T & { _id: string })[];
export const generalizedFirestoreDocumentUpdateOperation =
	<T extends GeneralizedUpdateBody>(collectionId: string) =>
	async (params: FirestoreDocumentUpdateParams<T>): Promise<unknown> => {
		try {
			// Get the Firestore collection reference
			const collectionRef = collection(firebaseFirestoreInstance, collectionId);

			// Normalize to array for handling both single and batch writes
			const writes = Array.isArray(params) ? params : [params];
			const chunkedWrites = chunkArray(writes, MAX_BATCH_SIZE);

			// Perform batch writes
			for (const writeChunk of chunkedWrites) {
				const batch = writeBatch(firebaseFirestoreInstance);

				for (const { _id, ...updateParams } of writeChunk) {
					const documentRef = doc(collectionRef, _id);
					batch.update(documentRef, updateParams);
				}

				await batch.commit();
			}

			return void 0;
		} catch (error) {
			return handleFirestoreOperationError(error);
		}
	};
