import { User as FirebaseUser } from 'firebase/auth';

// New function to handle user state and token updates
export const handleFirebaseUserChange =
	(setUser: React.Dispatch<FirebaseUser | null>) =>
	(user: FirebaseUser | null) => {
		setUser(user);
		return void (async () => {
			try {
				if (user) {
					const idToken = await user.getIdToken();
					// Consider using secure storage like httpOnly cookies
					localStorage.setItem('firebase_auth_jwt', idToken);
				} else {
					localStorage.removeItem('firebase_auth_jwt');
				}
			} catch (err) {
				console.error(err);
				localStorage.removeItem('firebase_auth_jwt');
			}
		})();
	};
