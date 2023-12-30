import { useEffect, useState } from 'react';
import { firebaseAuthInstance } from '../../../lib/firebase';
import { useAuthStateRedirect } from './useAuthStateRedirect';

export const useAuthenticatedRouteRedirect = () => {
	// ==== Component State ==== //
	const [authStateIsLoading, setAuthStateIsLoading] = useState(true);

	// ==== Hooks ==== //
	const allowAuthStates = authStateIsLoading
		? ['authenticated' as const, 'guest' as const]
		: ['authenticated' as const];
	useAuthStateRedirect({
		allowAuthStates,
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

				// Set the auth state to not loading
				setAuthStateIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		})();
	}, [authStateIsLoading]);

	return { allowAuthStates, authStateIsLoading };
};
