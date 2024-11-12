import { FirebaseError, initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirestoreError, getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config/firebaseConfig';
import { GeneralizedResponse, getGeneralizedError } from 'ergonomic';

export const firebaseApp = getApps().length
	? (getApps()[0] as ReturnType<typeof initializeApp>)
	: initializeApp(FIREBASE_CONFIG);

export const firebaseAuthInstance = getAuth(firebaseApp);
export const firebaseFirestoreInstance = getFirestore(firebaseApp);

// Helper function to handle Firestore errors and return a standardized error
export const handleFirestoreOperationError = (error: unknown) => {
	const response: GeneralizedResponse = { data: [], errors: [] };
	if (error instanceof FirebaseError || error instanceof FirestoreError) {
		const generalizedError = getGeneralizedError({
			category: 'request.unknown-error',
			data: { firestoreError: error },
			message: error.message,
			status_text: 'An unknown error occurred.',
		});
		console.error({ generalizedError });
		response.errors.push(generalizedError);
		return Promise.reject(response);
	}
	console.error({ error });
	const defaultError = getGeneralizedError();
	response.errors.push(defaultError);
	return Promise.reject(response);
};
