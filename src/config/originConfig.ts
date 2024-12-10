import { DEPLOYMENT_ENV } from './deploymentEnv';

const liveSiteOrigin = process.env.NEXT_PUBLIC_LIVE_SITE_URL;
const testSiteOrigin = process.env.NEXT_PUBLIC_TEST_SITE_URL;
export const siteOrigin = {
	live: liveSiteOrigin,
	test: testSiteOrigin,
}[DEPLOYMENT_ENV];

if (!siteOrigin) {
	throw new Error('Missing site origin');
}

export const SITE_ORIGIN = siteOrigin;

/**
 * Extracts and categorizes site origin URLs from the environment variables.
 *
 * @example
 *
 * #### .env
 *
 * ```plaintext
 * NEXT_PUBLIC_LIVE_SITE_URL_SSO_WEB_APP="https://sso-live.example.com";
 * NEXT_PUBLIC_TEST_SITE_URL_SSO_WEB_APP="https://sso-test.example.com";
 * NEXT_PUBLIC_LIVE_SITE_URL_BLOG_WEB_APP="https://blog-live.example.com";
 * NEXT_PUBLIC_TEST_SITE_URL_BLOG_WEB_APP="";
 * NEXT_PUBLIC_UNUSED_VAR="should not appear";
 * ```
 *
 * #### Result
 *
 * ```typescript
 * import { SITE_ORIGIN_BY_TARGET } from 'ergonomic-react/src/config/originConfig';
 *
 * // If DEPLOYMENT_ENV is 'live':
 * console.log(SITE_ORIGIN_BY_TARGET);
 * // => {
 * //   SSO_WEB_APP: 'https://sso-live.example.com',
 * //   BLOG_WEB_APP: 'https://blog-live.example.com',
 * // };
 *
 * // If DEPLOYMENT_ENV is 'test':
 * console.log(SITE_ORIGIN_BY_TARGET);
 * // => {
 * //   SSO_WEB_APP: 'https://sso-test.example.com',
 * // };
 * ```
 */
export const SITE_ORIGIN_BY_TARGET = Object.keys(process.env ?? {})
	.filter((key) => {
		const value = process.env[key];
		// Filter keys that match the desired pattern and have a valid value
		const isMatchingPattern = /_SITE_URL_.*_WEB_APP$/.test(key);
		return isMatchingPattern && value !== undefined && value !== '';
	})
	.reduce(
		(acc, key) => {
			const value = process.env[key];
			if (value) {
				// Extract target ("live" or "test") and app name
				const [, target, appName] =
					key.match(/_(LIVE|TEST)_SITE_URL_(.*)_WEB_APP$/) || [];
				if (target && appName) {
					const targetKey = target.toLowerCase() as 'live' | 'test';
					acc[targetKey][appName + '_WEB_APP'] = value;
				}
			}
			return acc;
		},
		{ live: {}, test: {} } as Record<'live' | 'test', Record<string, string>>,
	)[DEPLOYMENT_ENV];
