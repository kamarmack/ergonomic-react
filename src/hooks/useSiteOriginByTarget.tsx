import { useEffect, useState } from 'react';
import { DEPLOYMENT_ENV } from '../config/deploymentEnv';

export const useSiteOriginByTarget = () => {
	const [siteOriginByTarget, setSiteOriginByTarget] = useState<
		Record<string, string>
	>({});

	useEffect(() => {
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
		 * // If DEPLOYMENT_ENV is 'live':
		 * console.log(siteOriginByTarget);
		 * // => {
		 * //   SSO_WEB_APP: 'https://sso-live.example.com',
		 * //   BLOG_WEB_APP: 'https://blog-live.example.com',
		 * // };
		 *
		 * // If DEPLOYMENT_ENV is 'test':
		 * console.log(siteOriginByTarget);
		 * // => {
		 * //   SSO_WEB_APP: 'https://sso-test.example.com',
		 * // };
		 * ```
		 */
		const siteOriginByTargetResult = Object.keys(process.env ?? {})
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
				{ live: {}, test: {} } as Record<
					'live' | 'test',
					Record<string, string>
				>,
			)[DEPLOYMENT_ENV];

		setSiteOriginByTarget(() => siteOriginByTargetResult);
	}, [process.env]);

	return siteOriginByTarget;
};
