import {
	FirestoreError,
	collection,
	doc,
	writeBatch,
} from 'firebase/firestore';
import {
	GeneralizedApiObject,
	GeneralizedApiObjectSpec,
	GeneralizedCreateBody,
	GeneralizedResponse,
	GeneralizedUpdateBody,
	getGeneralizedError,
} from 'ergonomic';
import { firebaseFirestoreInstance } from '../../../lib/firebase';

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

// Helper function to handle Firestore errors and return a standardized error
const handleFirestoreError = (error: unknown) => {
	if (error instanceof FirestoreError) {
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
};

export type FirestoreDocumentCreateParams<T extends GeneralizedCreateBody> =
	| T
	| T[];
export type FirestoreDocumentCreateResponse<T extends GeneralizedApiObject> =
	GeneralizedResponse<T>;
export const generalizedFirestoreDocumentCreateOperation =
	<T extends GeneralizedCreateBody, U extends GeneralizedApiObject>(
		collectionId: string,
		apiObjectSpec: GeneralizedApiObjectSpec,
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
					const documentData = apiObjectSpec.mergeCreateParams({
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
			return handleFirestoreError(error);
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
			return handleFirestoreError(error);
		}
	};
