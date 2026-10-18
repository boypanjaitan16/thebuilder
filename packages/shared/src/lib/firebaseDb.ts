import { type Firestore, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./firebase";
import { ensureAppCheck } from "./firebaseAppCheck";

let dbInstance: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
	const app = getFirebaseApp();
	if (!app) return null;
	if (!dbInstance) {
		// App Check must be running before Firestore's first request, since
		// Firestore is App Check–enforced in the Firebase console.
		ensureAppCheck(app);
		dbInstance = getFirestore(app);
	}
	return dbInstance;
}
