import { type Firestore, getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./firebase";

let dbInstance: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
	const app = getFirebaseApp();
	if (!app) return null;
	if (!dbInstance) dbInstance = getFirestore(app);
	return dbInstance;
}
