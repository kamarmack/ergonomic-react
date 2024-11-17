import { NextRouter } from 'next/router';
import { isDomAvailable } from '../../../utils/isDomAvailable';
import { SITE_ORIGIN_BY_TARGET } from '../../../config/originConfig';

export type RedirectToLoginPageParams = {
	authSiteOrigin?: string;
	loginRoutePath?: string;
	router: NextRouter;
};
export const redirectToLoginPage = ({
	authSiteOrigin = SITE_ORIGIN_BY_TARGET.SSO_WEB_APP,
	loginRoutePath = '/login',
	router,
}: RedirectToLoginPageParams) => {
	if (!isDomAvailable()) return;
	if (!authSiteOrigin) {
		throw new Error(
			'Missing auth site origin. Set this value as an environment variable.',
		);
	}

	const origin = window.location.origin;
	const pathname = window.location.pathname;

	return void router.replace(
		`${authSiteOrigin}${loginRoutePath}?dest=${encodeURIComponent(
			`${origin}${pathname}`,
		)}`,
	);
};
