import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuthInstance } from '../lib/firebase';
import { AuthContext } from '../providers/AuthProvider';
import { isDomAvailable } from '../utils/isDomAvailable';

const DEFAULT_ALLOW_AUTH_STATES = ['authenticated' as const, 'guest' as const];
export type UseAuthOptions = {
	allowAuthStates?: ('authenticated' | 'guest')[];
	useRedirects?: boolean;
};
export const useAuth = (
	options: UseAuthOptions = {
		allowAuthStates: DEFAULT_ALLOW_AUTH_STATES,
		useRedirects: true,
	},
) => {
	const { allowAuthStates = DEFAULT_ALLOW_AUTH_STATES, useRedirects = true } =
		options;
	const router = useRouter();
	const authContext = useContext(AuthContext);

	const redirectToLogin = () => {
		const origin = window.location.origin;
		const pathname = window.location.pathname;
		const dest = `${origin}${pathname}`;
		localStorage.setItem('dest', dest);
		return void router.replace(
			`/login?dest=${encodeURIComponent(`${origin}${pathname}`)}`,
		);
	};

	useEffect(() => {
		if (!isDomAvailable()) return;
		if (!router.isReady) return;

		// Authenticated users
		if (!allowAuthStates.includes('guest')) {
			if (!authContext?.user) {
				if (useRedirects) {
					redirectToLogin();
				}
			}
		}

		return;
	}, [
		isDomAvailable(),
		authContext?.user,
		router.isReady,
		allowAuthStates?.join(),
		useRedirects,
	]);

	const handleLogin = async (email: string, password: string) => {
		try {
			console.log('Signing in...', { email, password });
			const userCredential = await signInWithEmailAndPassword(
				firebaseAuthInstance,
				email,
				password,
			);
			const user = userCredential.user;
			console.log('Signed in as: ', { user });

			if (useRedirects) {
				const dest = localStorage.getItem('dest');
				if (dest) {
					console.log('Found destination, redirecting to: ', dest);
					localStorage.removeItem('dest');
					return void router.replace(dest);
				}
				console.log('No destination found, redirecting to /');
				return void router.replace('/');
			}

			return void 0;
		} catch (err) {
			console.error('Error signing in: ', err);
			return void 0;
		}
	};

	const handleLogout = async () => {
		try {
			console.log('Signing out...');
			await firebaseAuthInstance.signOut();

			if (useRedirects) {
				redirectToLogin();
			}
		} catch (err) {
			console.error(err);
		}
	};

	return { ...authContext, handleLogout, handleLogin };
};
