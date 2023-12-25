import { createContext, useEffect, useState } from 'react';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { firebaseApp } from '../../../lib/firebase';

const auth = getAuth(firebaseApp);

export type AuthProviderState = {
	authStateIsLoading: boolean;
	user: FirebaseUser | null;
};
export const AuthContext = createContext<AuthProviderState>({
	authStateIsLoading: true,
	user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [authStateIsLoading, setAuthStateIsLoading] = useState(true);
	const [user, setUser] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		if (!authStateIsLoading) return;

		return void (async () => {
			try {
				// Check the auth state
				await auth.authStateReady();

				// Wait 500ms
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Set the auth state to not loading
				setAuthStateIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		})();
	}, [authStateIsLoading]);

	useEffect(() => {
		if (authStateIsLoading) return;

		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(() => user);
		});

		return () => unsubscribe();
	}, [authStateIsLoading]);

	return (
		<AuthContext.Provider value={{ authStateIsLoading, user }}>
			{children}
		</AuthContext.Provider>
	);
};
