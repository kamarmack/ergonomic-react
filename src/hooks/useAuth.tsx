import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH_INSTANCE } from '../lib/firebase';
import { AuthContext } from '../providers/AuthProvider';
import { isDomAvailable } from '../utils/isDomAvailable';

export const useAuth = (
	allowAuthStates: ('authenticated' | 'guest')[] = ['authenticated', 'guest'],
) => {
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
				redirectToLogin();
			}
		}

		return;
	}, [
		isDomAvailable(),
		authContext?.user,
		router.isReady,
		allowAuthStates?.join(),
	]);

	const handleLogout = async () => {
		try {
			console.log('Signing out...');
			await FIREBASE_AUTH_INSTANCE.signOut();
			redirectToLogin();
		} catch (err) {
			console.error(err);
		}
	};

	const handleLogin = async (email: string, password: string) => {
		try {
			console.log('Signing in...', { email, password });
			const userCredential = await signInWithEmailAndPassword(
				FIREBASE_AUTH_INSTANCE,
				email,
				password,
			);
			const user = userCredential.user;
			console.log('Signed in as: ', { user });

			const dest = localStorage.getItem('dest');
			if (dest) {
				console.log('Found destination, redirecting to: ', dest);
				localStorage.removeItem('dest');
				return void router.replace(dest);
			} else {
				console.log('No destination found, redirecting to /');
				return void router.replace('/');
			}
		} catch (err) {
			console.error('Error signing in: ', err);
		}
	};

	return { ...authContext, handleLogout, handleLogin };
};
