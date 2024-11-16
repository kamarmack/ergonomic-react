import { Options } from 'ky-universal';
import { DEPLOYMENT_ENV } from './deploymentEnv';

const productionRestAPIBaseURL =
	process.env.NEXT_PUBLIC_PRODUCTION_REST_API_BASE_URL;
const stagingRestAPIBaseURL = process.env.NEXT_PUBLIC_STAGING_REST_API_BASE_URL;

export const REST_API_PREFIX_URL = {
	production: productionRestAPIBaseURL,
	staging: stagingRestAPIBaseURL,
}[DEPLOYMENT_ENV];

export const GENERALIZED_KY_CONFIG: Options = {
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	prefixUrl: REST_API_PREFIX_URL,
	throwHttpErrors: true,
	timeout: 45 * 1000, // Timeout after 45 seconds
};
