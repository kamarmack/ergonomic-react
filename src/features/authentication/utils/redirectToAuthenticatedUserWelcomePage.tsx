import { NextRouter } from 'next/router';
import { isDomAvailable } from '../../../utils/isDomAvailable';
import { SITE_ORIGIN } from '../../../config/originConfig';

export type RedirectToAuthenticatedUserWelcomePageParams = {
	router: NextRouter;
	welcomeRoutePath?: string;
	welcomeSiteOrigin?: string;
};
export const redirectToAuthenticatedUserWelcomePage = ({
	router,
	welcomeRoutePath = '/',
	welcomeSiteOrigin = SITE_ORIGIN,
}: RedirectToAuthenticatedUserWelcomePageParams) => {
	if (!isDomAvailable()) return;
	return void router.replace(`${welcomeSiteOrigin}${welcomeRoutePath}`);
};
