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

const productionSsoSiteOrigin =
	process.env.NEXT_PUBLIC_PRODUCTION_SITE_URL_SSO_WEB_APP;
const stagingSsoSiteOrigin =
	process.env.NEXT_PUBLIC_STAGING_SITE_URL_SSO_WEB_APP;
export const SSO_SITE_ORIGIN = {
	production: productionSsoSiteOrigin,
	staging: stagingSsoSiteOrigin,
}[DEPLOYMENT_ENV];
