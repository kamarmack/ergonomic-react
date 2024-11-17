import { Options } from 'ky-universal';
import { DEPLOYMENT_ENV } from './deploymentEnv';

const liveRestAPIBaseURL = process.env.NEXT_PUBLIC_LIVE_REST_API_BASE_URL;
const testRestAPIBaseURL = process.env.NEXT_PUBLIC_TEST_REST_API_BASE_URL;

const restApiBaseUrl = {
	live: liveRestAPIBaseURL,
	test: testRestAPIBaseURL,
}[DEPLOYMENT_ENV];

if (!restApiBaseUrl) {
	throw new Error('Missing REST API base URL');
}

export const REST_API_PREFIX_URL = restApiBaseUrl;

export const GENERALIZED_KY_CONFIG: Options = {
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	prefixUrl: REST_API_PREFIX_URL,
	throwHttpErrors: true,
	timeout: 45 * 1000, // Timeout after 45 seconds
};
