import { useEffect, useState } from 'react';
import { firebaseAuthInstance } from '../../../lib/firebase';
import { useAuthStateRedirect } from './useAuthStateRedirect';
import { RedirectToLoginPageParams } from '../utils/redirectToLoginPage';
import { useSiteOriginByTarget } from '../../../hooks/useSiteOriginByTarget';

export const useAuthenticatedRouteRedirect = (
	options: Partial<Omit<RedirectToLoginPageParams, 'router'>> = {},
) => {
	// ==== Component State ==== //
	const [authStateIsLoading, setAuthStateIsLoading] = useState(true);

	// ==== Hooks ==== //
	const siteOriginByTarget = useSiteOriginByTarget();
	const authSiteOrigin = siteOriginByTarget.SSO_WEB_APP ?? '';
	const allowAuthStates = authStateIsLoading
		? ['authenticated' as const, 'guest' as const]
		: ['authenticated' as const];
	useAuthStateRedirect({
		allowAuthStates,
		authSiteOrigin,
		...options,
	});

	// ==== Effects ==== //
	useEffect(() => {
		if (!authStateIsLoading) return;

		return void (async () => {
			try {
				// Check the auth state
				await firebaseAuthInstance.authStateReady();

				// Wait 1 second
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				console.error(error);
			} finally {
				// Set the auth state to not loading
				setAuthStateIsLoading(false);
			}
		})();
	}, [authStateIsLoading]);

	return { allowAuthStates, authStateIsLoading };
};
