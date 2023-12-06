import { default as ky } from 'ky-universal';

export const getCustomToken = async ({ id_token }: { id_token: string }) => {
	const data = await ky
		.post('auth/custom-token', {
			json: { id_token },
			prefixUrl: process.env.NEXT_PUBLIC_REST_API_BASE_URL,
		})
		.json<{
			custom_token: string;
		}>();
	return data;
};
