import { default as ky } from 'ky-universal';
import {
	FirebaseAuthCustomTokenParams,
	FirebaseAuthCustomTokenResponse,
} from 'ergonomic';

export const getFirebaseAuthCustomToken = async (
	json: FirebaseAuthCustomTokenParams,
) => {
	const data = await ky
		.post('v0/auth/custom-token', {
			json,
			prefixUrl: process.env.NEXT_PUBLIC_REST_API_BASE_URL,
		})
		.json<FirebaseAuthCustomTokenResponse>();
	return data;
};
