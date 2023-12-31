import { Options } from 'ky-universal';

export const generalizedKyConfig: Options = {
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	prefixUrl: process.env.NEXT_PUBLIC_REST_API_BASE_URL,
	throwHttpErrors: true,
	timeout: 45 * 1000, // Timeout after 45 seconds
};
