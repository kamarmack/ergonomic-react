import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config/firebaseConfig';

export const firebaseApp = getApps().length
	? (getApps()[0] as ReturnType<typeof initializeApp>)
	: initializeApp(FIREBASE_CONFIG);

export const firebaseAuthInstance = getAuth(firebaseApp);
export const firebaseFirestoreInstance = getFirestore(firebaseApp);
