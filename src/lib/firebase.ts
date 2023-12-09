import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const FIREBASE_CONFIG = {
	apiKey: process.env.NEXT_PUBLIC_CONFIG_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_CONFIG_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_CONFIG_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_CONFIG_FIREBASE_STORAGE_BUCKET,
	messagingSenderId:
		process.env.NEXT_PUBLIC_CONFIG_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_CONFIG_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_CONFIG_FIREBASE_MEASUREMENT_ID,
};
export const FIREBASE_APP = getApps().length
	? (getApps()[0] as ReturnType<typeof initializeApp>)
	: initializeApp(FIREBASE_CONFIG);

export const FIREBASE_AUTH_INSTANCE = getAuth(FIREBASE_APP);
