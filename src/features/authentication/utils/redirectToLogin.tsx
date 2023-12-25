import { NextRouter } from 'next/router';
import { isDomAvailable } from '../../../utils/isDomAvailable';

export type RedirectToOriginParams = {
	authSiteOrigin?: string;
	loginRoutePath?: string;
	router: NextRouter;
};
export const redirectToLogin = ({
	authSiteOrigin = process.env.NEXT_PUBLIC_SITE_URL_SSO_WEB_APP as string,
	loginRoutePath = '/login',
	router,
}: RedirectToOriginParams) => {
	if (!isDomAvailable()) return;

	const origin = window.location.origin;
	const pathname = window.location.pathname;

	return void router.replace(
		`${authSiteOrigin}${loginRoutePath}?dest=${encodeURIComponent(
			`${origin}${pathname}`,
		)}`,
	);
};
