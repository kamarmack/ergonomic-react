import { useEffect, useState } from 'react';
import { firebaseAuthInstance } from '../../../lib/firebase';
import { useAuthStateRedirect } from './useAuthStateRedirect';
import { RedirectToAuthenticatedUserWelcomePageParams } from '../utils/redirectToAuthenticatedUserWelcomePage';

export const useGuestRouteRedirect = (
	options: Omit<RedirectToAuthenticatedUserWelcomePageParams, 'router'> = {},
) => {
	// ==== Component State ==== //
	const [authStateIsLoading, setAuthStateIsLoading] = useState(true);

	// ==== Hooks ==== //
	const allowAuthStates = authStateIsLoading
		? ['authenticated' as const, 'guest' as const]
		: ['guest' as const];
	useAuthStateRedirect({
		allowAuthStates,
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
