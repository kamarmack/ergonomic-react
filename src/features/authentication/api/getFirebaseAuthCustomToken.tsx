import {
	FirebaseAuthCustomTokenParams,
	FirebaseAuthCustomTokenResponse,
} from 'ergonomic';
import { defaultKyInstance } from '../../../lib/ky';

export const getFirebaseAuthCustomToken = async (
	json: FirebaseAuthCustomTokenParams,
) => {
	const data = await defaultKyInstance
		.post('v0/auth/custom-token', {
			json,
		})
		.json<FirebaseAuthCustomTokenResponse>();
	return data;
};
