import { DEPLOYMENT_ENV } from './deploymentEnv';

const liveConfig = {
	apiKey: process.env.NEXT_PUBLIC_LIVE_FIREBASE_API_KEY,
	appId: process.env.NEXT_PUBLIC_LIVE_FIREBASE_APP_ID,
	authDomain: process.env.NEXT_PUBLIC_LIVE_FIREBASE_AUTH_DOMAIN,
	measurementId: process.env.NEXT_PUBLIC_LIVE_FIREBASE_MEASUREMENT_ID,
	messagingSenderId: process.env.NEXT_PUBLIC_LIVE_FIREBASE_MESSAGING_SENDER_ID,
	projectId: process.env.NEXT_PUBLIC_LIVE_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_LIVE_FIREBASE_STORAGE_BUCKET,
};

const testConfig = {
	apiKey: process.env.NEXT_PUBLIC_TEST_FIREBASE_API_KEY,
	appId: process.env.NEXT_PUBLIC_TEST_FIREBASE_APP_ID,
	authDomain: process.env.NEXT_PUBLIC_TEST_FIREBASE_AUTH_DOMAIN,
	measurementId: process.env.NEXT_PUBLIC_TEST_FIREBASE_MEASUREMENT_ID,
	messagingSenderId: process.env.NEXT_PUBLIC_TEST_FIREBASE_MESSAGING_SENDER_ID,
	projectId: process.env.NEXT_PUBLIC_TEST_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_TEST_FIREBASE_STORAGE_BUCKET,
};

export const FIREBASE_CONFIG = {
	live: liveConfig,
	test: testConfig,
}[DEPLOYMENT_ENV];
