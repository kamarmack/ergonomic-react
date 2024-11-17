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

const liveSsoSiteOrigin = process.env.NEXT_PUBLIC_LIVE_SITE_URL_SSO_WEB_APP;
const testSsoSiteOrigin = process.env.NEXT_PUBLIC_TEST_SITE_URL_SSO_WEB_APP;
export const SSO_SITE_ORIGIN = {
	live: liveSsoSiteOrigin,
	test: testSsoSiteOrigin,
}[DEPLOYMENT_ENV];
