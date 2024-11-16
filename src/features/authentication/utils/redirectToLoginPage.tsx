import { NextRouter } from 'next/router';
import { isDomAvailable } from '../../../utils/isDomAvailable';
import { SSO_SITE_ORIGIN } from '../../../config/originConfig';

export type RedirectToLoginPageParams = {
	authSiteOrigin?: string;
	loginRoutePath?: string;
	router: NextRouter;
};
export const redirectToLoginPage = ({
	authSiteOrigin = SSO_SITE_ORIGIN,
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
