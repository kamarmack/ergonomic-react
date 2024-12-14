import { User as FirebaseUser } from 'firebase/auth';
import { isDomAvailable } from '../../../utils/isDomAvailable';

export const getCachedFirebaseUserJwt = async (
	firebaseUser: FirebaseUser,
	options: { forceRefresh?: boolean } = {},
) => {
	try {
		if (!isDomAvailable()) {
			console.error('DOM not available');
			return null;
		}

		const cachedToken = localStorage.getItem('firebase_auth_jwt');
		const forceRefresh = options?.forceRefresh === true;
		const token =
			forceRefresh || !cachedToken
				? await firebaseUser.getIdToken(forceRefresh)
				: cachedToken;

		if (!token) {
			console.error('No token found');
			return null;
		}

		localStorage.setItem('firebase_auth_jwt', token);
		return token;
	} catch (err) {
		console.error('Error getting firebase auth token for ky instance', err);
		return null;
	}
};
