declare module "*.yaml?raw" {
	const content: string;
	export default content;
}

// Firebase App Check debug mode (dev only).
declare global {
	var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}

export {};
