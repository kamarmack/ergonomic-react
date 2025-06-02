import { User as FirebaseUser } from 'firebase/auth';
import { baseLocalStorageUtil } from '../../../lib/localStorage';

// New function to handle user state and token updates
export const handleFirebaseUserChange =
	(setUser: React.Dispatch<React.SetStateAction<FirebaseUser | null>>) =>
	(user: FirebaseUser | null) => {
		setUser(() => user);
		return void (async () => {
			let firebaseAuthJwt: string | null = null;
			try {
				if (user) {
					firebaseAuthJwt = await user.getIdToken();
					// Consider using secure storage like httpOnly cookies
					baseLocalStorageUtil.saveToLocalStorage({
						key: 'firebaseAuthJwt',
						value: firebaseAuthJwt,
					});
				}
			} catch (err) {
				console.error(err);
			} finally {
				if (!firebaseAuthJwt) {
					baseLocalStorageUtil.removeFromLocalStorage({
						key: 'firebaseAuthJwt',
					});
				}
			}
		})();
	};
