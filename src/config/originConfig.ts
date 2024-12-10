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
