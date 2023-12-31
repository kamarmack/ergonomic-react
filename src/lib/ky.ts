import { default as ky } from 'ky-universal';
import { User as FirebaseUser } from 'firebase/auth';
import { GENERALIZED_KY_CONFIG } from '../config/kyConfig';
import { getCachedFirebaseUserJwt } from '../features/authentication';

export const generalizedKyInstance = ky.create(GENERALIZED_KY_CONFIG);
export const getAuthenticatedGeneralizedKyInstance = (
	firebaseUser: FirebaseUser,
	defaultKyInstance: typeof ky = generalizedKyInstance,
) =>
	defaultKyInstance.extend({
		hooks: {
			beforeRequest: [
				async (request) => {
					// Get the Firebase Auth ID token
					const token = await getCachedFirebaseUserJwt(firebaseUser);

					// If no token found, throw an error
					if (!token) throw new Error('No token found');

					// Set the Authorization header
					request.headers.set('Authorization', `Bearer ${token}`);
				},
			],
			afterResponse: [
				async (request, options, response) => {
					if (response.status === 401) {
						// Check whether a retry has already been attempted
						if (request.headers.get('X-Retry-Attempt')) {
							return response;
						}

						// Get a fresh token
						const token = await getCachedFirebaseUserJwt(firebaseUser, {
							forceRefresh: true,
						});

						// If no token found, throw an error
						if (!token) throw new Error('No token found');

						// Set the Authorization header
						request.headers.set('Authorization', `Bearer ${token}`);

						// Indicate that this is a retry
						request.headers.set('X-Retry-Attempt', '1');

						// Retry the request
						return defaultKyInstance(request, options);
					}
					return response;
				},
			],
		},
	});
