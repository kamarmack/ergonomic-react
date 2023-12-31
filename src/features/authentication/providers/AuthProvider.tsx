import { createContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuthInstance } from '../../../lib/firebase';
import { handleFirebaseUserChange } from '../utils/handleFirebaseUserChange';

export type AuthProviderState = {
	user: FirebaseUser | null;
};
export const AuthContext = createContext<AuthProviderState>({
	user: null,
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<FirebaseUser | null>(null);

	useEffect(() => {
		const unsubscribe = firebaseAuthInstance.onAuthStateChanged(
			handleFirebaseUserChange(setUser),
		);

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};
