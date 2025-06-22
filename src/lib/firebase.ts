import { FirebaseError, initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirestoreError, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../config/firebaseConfig';
import { getGeneralizedError } from 'ergonomic';

export const firebaseApp = getApps().length
	? (getApps()[0] as ReturnType<typeof initializeApp>)
	: initializeApp(FIREBASE_CONFIG);

export const firebaseAuthInstance = getAuth(firebaseApp);
export const firebaseFirestoreInstance = getFirestore(firebaseApp);
export const firebaseStorageInstance = getStorage(firebaseApp);

// Helper function to handle Firestore errors and return a standardized error
export const handleFirestoreOperationError = (error: unknown) => {
	if (error instanceof FirebaseError || error instanceof FirestoreError) {
		const generalizedError = getGeneralizedError({
			data: { firestoreError: error },
			message: error.message,
			status_text: 'An unknown error occurred.',
			type: 'request.unknown-error',
		});
		console.error({ generalizedError });
		return Promise.reject(generalizedError);
	}
	console.error({ error });
	return Promise.reject(getGeneralizedError());
};
