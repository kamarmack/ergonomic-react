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
		auth
			.authStateReady()
			.then(() => {
				setAuthStateIsLoading(false);
				return;
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

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
