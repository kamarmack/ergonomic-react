import {
	FirebaseUserCustomTokenParams,
	FirebaseUserCustomTokenResponse,
} from 'ergonomic';
import { generalizedKyInstance } from '../../../lib/ky';

export const getFirebaseUserCustomToken = async (
	json: FirebaseUserCustomTokenParams,
) => {
	const data = await generalizedKyInstance
		.post('v0/auth/custom-token', {
			json,
		})
		.json<FirebaseUserCustomTokenResponse>();
	return data;
};
