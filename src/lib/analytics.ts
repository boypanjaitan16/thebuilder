import {
	type Analytics,
	initializeAnalytics,
	isSupported,
	logEvent,
} from "firebase/analytics";
import { env } from "./env";
import { getFirebaseApp } from "./firebase";

let analyticsPromise: Promise<Analytics | null> | null = null;

async function resolveAnalytics() {
	if (!env.firebaseMeasurementId) return null;
	if (typeof window === "undefined") return null;
	const supported = await isSupported();
	if (!supported) return null;
	const app = getFirebaseApp();
	if (!app) return null;
	// Page views are sent manually by trackPageView, so admin routes can be
	// excluded and the initial load isn't counted twice.
	return initializeAnalytics(app, { config: { send_page_view: false } });
}

export function initAnalytics() {
	if (!analyticsPromise) analyticsPromise = resolveAnalytics();
	return analyticsPromise;
}

// The admin portal (/admin and /admin/**) is never tracked.
export function isTrackedPath(path: string) {
	return !/^\/admin(\/|\?|#|$)/.test(path);
}

export async function trackPageView(path: string) {
	if (import.meta.env.MODE !== "production") return;
	if (!isTrackedPath(path)) return;
	const analytics = await initAnalytics();

	if (!analytics) return;
	logEvent(analytics, "page_view", {
		page_path: path,
		page_location: window.location.href,
		page_title: document.title,
	});
}
