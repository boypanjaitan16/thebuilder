import { type Auth, getAuth } from "firebase/auth";
import { getFirebaseApp } from "./firebase";

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
	const app = getFirebaseApp();
	if (!app) return null;
	if (!authInstance) authInstance = getAuth(app);
	return authInstance;
}

const AUTH_USER_REFRESH_EVENT = "firebase-auth-user-refresh";

// onAuthStateChanged only fires on sign-in/out/token refresh, not on
// updateProfile/updatePassword. Components subscribe independently via
// useFirebaseSession, so this notifies them to resync after a profile edit.
export function notifyAuthUserRefresh() {
	window.dispatchEvent(new Event(AUTH_USER_REFRESH_EVENT));
}

export function onAuthUserRefresh(callback: () => void) {
	window.addEventListener(AUTH_USER_REFRESH_EVENT, callback);
	return () => window.removeEventListener(AUTH_USER_REFRESH_EVENT, callback);
}
