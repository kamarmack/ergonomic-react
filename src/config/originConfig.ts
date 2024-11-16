import { DEPLOYMENT_ENV } from './deploymentEnv';

const productionSiteOrigin = process.env.NEXT_PUBLIC_PRODUCTION_SITE_URL;
const stagingSiteOrigin = process.env.NEXT_PUBLIC_STAGING_SITE_URL;
export const siteOrigin = {
	production: productionSiteOrigin,
	staging: stagingSiteOrigin,
}[DEPLOYMENT_ENV];

if (!siteOrigin) {
	throw new Error('Missing site origin');
}

export const SITE_ORIGIN = siteOrigin;
