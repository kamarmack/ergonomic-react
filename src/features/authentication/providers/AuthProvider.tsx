import { createContext, useEffect, useState } from 'react';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { firebaseApp } from '../../../lib/firebase';

const auth = getAuth(firebaseApp);

export const AuthContext = createContext<{ user: FirebaseUser | null }>({
	user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(() => user);
			} else {
				setUser(null);
			}
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};