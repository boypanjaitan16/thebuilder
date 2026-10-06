declare module "*.yaml?raw" {
	const content: string;
	export default content;
}

// Firebase App Check debug mode (dev only, see src/lib/firebaseAppCheck.ts).
declare var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
