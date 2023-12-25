import { NextRouter } from 'next/router';
import { isDomAvailable } from '../../../utils/isDomAvailable';

export type RedirectToAuthenticatedUserWelcomePageParams = {
	router: NextRouter;
	welcomeRoutePath?: string;
	welcomeSiteOrigin?: string;
};
export const redirectToAuthenticatedUserWelcomePage = ({
	router,
	welcomeRoutePath = '/',
	welcomeSiteOrigin = process.env.NEXT_PUBLIC_SITE_URL as string,
}: RedirectToAuthenticatedUserWelcomePageParams) => {
	if (!isDomAvailable()) return;
	return void router.replace(`${welcomeSiteOrigin}${welcomeRoutePath}`);
};
