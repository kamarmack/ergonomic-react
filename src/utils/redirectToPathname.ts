import { NextRouter } from 'next/router';
import { isDomAvailable } from './isDomAvailable';

export const redirectToPathname = (router: NextRouter) => {
	if (!isDomAvailable()) return;
	return void router.replace(window.location.pathname);
};
