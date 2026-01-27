import { type FirebaseApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig =
	Boolean(firebaseConfig.apiKey) &&
	Boolean(firebaseConfig.projectId) &&
	Boolean(firebaseConfig.appId);

export function getFirebaseApp(): FirebaseApp | null {
	if (!hasFirebaseConfig) return null;
	return getApps()[0] ?? initializeApp(firebaseConfig);
}
