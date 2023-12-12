import { isDomAvailable } from '../utils/isDomAvailable';
import { FIREBASE_CONFIG } from './firebaseConfig';
import { NODE_ENV } from './nodeEnv';

export const ENABLE_GOOGLE_ANALYTICS =
	isDomAvailable() &&
	NODE_ENV === 'production' &&
	!!FIREBASE_CONFIG.measurementId;
