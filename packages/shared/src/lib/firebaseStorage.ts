import { type FirebaseStorage, getStorage } from "firebase/storage";
import { getFirebaseApp } from "./firebase";

let storageInstance: FirebaseStorage | null = null;

export function getFirebaseStorage(): FirebaseStorage | null {
	const app = getFirebaseApp();
	if (!app) return null;
	if (!storageInstance) storageInstance = getStorage(app);
	return storageInstance;
}
