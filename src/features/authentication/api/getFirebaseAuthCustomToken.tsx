import {
	FirebaseAuthCustomTokenParams,
	FirebaseAuthCustomTokenResponse,
} from 'ergonomic';
import { generalizedKyInstance } from '../../../lib/ky';

export const getFirebaseAuthCustomToken = async (
	json: FirebaseAuthCustomTokenParams,
) => {
	const data = await generalizedKyInstance
		.post('v0/auth/custom-token', {
			json,
		})
		.json<FirebaseAuthCustomTokenResponse>();
	return data;
};
