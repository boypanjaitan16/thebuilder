import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { env } from "./env";

const firebaseConfig = {
	apiKey: env.firebaseApiKey,
	authDomain: env.firebaseAuthDomain,
	projectId: env.firebaseProjectId,
	storageBucket: env.firebaseStorageBucket,
	messagingSenderId: env.firebaseMessagingSenderId,
	appId: env.firebaseAppId,
	measurementId: env.firebaseMeasurementId,
};

const hasFirebaseConfig =
	Boolean(firebaseConfig.apiKey) &&
	Boolean(firebaseConfig.projectId) &&
	Boolean(firebaseConfig.appId);

export function getFirebaseApp(): FirebaseApp | null {
	if (!hasFirebaseConfig) return null;
	return getApps()[0] ?? initializeApp(firebaseConfig);
}
