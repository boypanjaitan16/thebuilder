import type { FirebaseApp } from "firebase/app";
import {
	initializeAppCheck,
	ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { env } from "./env";
import { isPrerendering } from "./prerender";

let attempted = false;

/**
 * Starts Firebase App Check (reCAPTCHA Enterprise) once per page load.
 * Skipped during prerender: headless Chrome can't get a valid token, so
 * the prerendered HTML of Firestore-backed pages captures their loading
 * state instead (see `isPrerendering` in the public read hooks).
 */
export function ensureAppCheck(app: FirebaseApp): void {
	if (attempted) return;
	attempted = true;

	if (typeof window === "undefined") return;
	if (isPrerendering()) return;
	if (!env.firebaseAppCheckSiteKey) return;

	if (import.meta.env.DEV) {
		// `true` makes the SDK print a fresh debug token to the console; register
		// it in Firebase Console → App Check, then pin it via the env var.
		globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN =
			env.firebaseAppCheckDebugToken || true;
	}

	initializeAppCheck(app, {
		provider: new ReCaptchaEnterpriseProvider(env.firebaseAppCheckSiteKey),
		isTokenAutoRefreshEnabled: true,
	});
}
