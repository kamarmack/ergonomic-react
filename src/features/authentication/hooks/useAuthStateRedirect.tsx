import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithCustomToken } from 'firebase/auth';
import { firebaseAuthInstance } from '../../../lib/firebase';
import { redirectToPathname } from '../../../utils/redirectToPathname';
import {
	RedirectToLoginPageParams,
	redirectToLoginPage,
} from '../utils/redirectToLoginPage';
import {
	RedirectToAuthenticatedUserWelcomePageParams,
	redirectToAuthenticatedUserWelcomePage,
} from '../utils/redirectToAuthenticatedUserWelcomePage';
import { AuthContext } from '../providers/AuthProvider';

const DEFAULT_ALLOW_AUTH_STATES = ['authenticated' as const, 'guest' as const];

export type UseAuthStateRedirectOptions = {
	allowAuthStates?: ('authenticated' | 'guest')[];
} & Omit<RedirectToLoginPageParams, 'router'> &
	Omit<RedirectToAuthenticatedUserWelcomePageParams, 'router'>;

export const useAuthStateRedirect = (
	options: UseAuthStateRedirectOptions = {
		allowAuthStates: DEFAULT_ALLOW_AUTH_STATES,
	},
) => {
	// ==== Hooks ==== //

	// Router
	const router = useRouter();

	// Auth Context
	const authContext = useContext(AuthContext);

	// ==== Constants ==== //

	// Router Query
	const query: Record<string, string | null | undefined> =
		(router?.query as Record<string, string | null>) ?? {};

	// Router Query Param Values
	const { client_token } = query;

	// Redirect Options
	const { allowAuthStates = DEFAULT_ALLOW_AUTH_STATES } = options;

	// Auth State Flags
	const allowGuestUsers = allowAuthStates.includes('guest');
	const allowAuthenticatedUsers = allowAuthStates.includes('authenticated');

	// ==== Effects ==== //

	// Redirect to Login Page if User is not Authenticated and Guest Users are not allowed
	// Redirect to Authenticated User Welcome Page if User is Authenticated and Authenticated Users are not allowed
	useEffect(() => {
		if (!router.isReady) return;

		if (authContext.user) {
			if (allowAuthenticatedUsers) return;
			if (localStorage.getItem('pause_firebase_auth_redirects')) return;

			redirectToAuthenticatedUserWelcomePage({ ...options, router });
			return;
		}

		if (client_token) {
			return void (async () => {
				try {
					await signInWithCustomToken(firebaseAuthInstance, client_token);
					redirectToPathname(router);
				} catch (err) {
					console.error(err);
					redirectToLoginPage({ ...options, router });
				}
			})();
		}

		if (allowGuestUsers) return;

		redirectToLoginPage({ ...options, router });
		return;
	}, [authContext.user, client_token, router.isReady, allowAuthStates.join()]);

	return { ...authContext };
};
