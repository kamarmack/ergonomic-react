import { createContext, useEffect, useState } from 'react';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { firebaseApp } from '../../../lib/firebase';

const auth = getAuth(firebaseApp);

export type AuthProviderState = {
	user: FirebaseUser | null;
};
export const AuthContext = createContext<AuthProviderState>({
	user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(() => user);
			return void (async () => {
				try {
					if (user) {
						const idToken = await user.getIdToken();
						localStorage.setItem('firebase_auth_jwt', idToken);
					} else {
						localStorage.removeItem('firebase_auth_jwt');
					}
				} catch (err) {
					console.error(err);
					localStorage.removeItem('firebase_auth_jwt');
				}
			})();
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};
