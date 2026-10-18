import {
	getFirebaseAuth,
	onAuthUserRefresh,
} from "@thebuilder/shared/lib/firebaseAuth";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

export function useFirebaseSession() {
	const [user, setUser] = useState<User | null>(null);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		const auth = getFirebaseAuth();
		if (!auth) {
			setChecking(false);
			return;
		}

		const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
			setUser(nextUser);
			setChecking(false);
		});
		const unsubscribeRefresh = onAuthUserRefresh(() =>
			setUser(auth.currentUser),
		);

		return () => {
			unsubscribeAuth();
			unsubscribeRefresh();
		};
	}, []);

	const isAuthenticated = useMemo(() => Boolean(user), [user]);

	return { user, checking, isAuthenticated };
}
