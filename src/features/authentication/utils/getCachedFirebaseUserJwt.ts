import { User as FirebaseUser } from 'firebase/auth';
import { isDomAvailable } from '../../../utils/isDomAvailable';
import { baseLocalStorageUtil } from '../../../lib/localStorage';

export const getCachedFirebaseUserJwt = async (
	firebaseUser: FirebaseUser,
	options: { forceRefresh?: boolean } = {},
) => {
	try {
		if (!isDomAvailable()) {
			console.error('DOM not available');
			return null;
		}

		const firebaseAuthJwt = baseLocalStorageUtil.retrieveFromLocalStorage({
			key: 'firebaseAuthJwt',
		});
		const forceRefresh = options?.forceRefresh === true;
		const nextFirebaseAuthJwt =
			forceRefresh || !firebaseAuthJwt
				? await firebaseUser.getIdToken(forceRefresh)
				: firebaseAuthJwt;

		if (!nextFirebaseAuthJwt) {
			console.error('No token found');
			return null;
		}

		baseLocalStorageUtil.saveToLocalStorage({
			key: 'firebaseAuthJwt',
			value: nextFirebaseAuthJwt,
		});
		return nextFirebaseAuthJwt;
	} catch (err) {
		console.error('Error getting firebase auth token for ky instance', err);
		return null;
	}
};
