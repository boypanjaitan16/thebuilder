import {
	type Analytics,
	getAnalytics,
	isSupported,
	logEvent,
} from "firebase/analytics";
import { getFirebaseApp } from "./firebase";

let analyticsPromise: Promise<Analytics | null> | null = null;

async function resolveAnalytics() {
	if (!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) return null;
	if (typeof window === "undefined") return null;
	const supported = await isSupported();
	if (!supported) return null;
	const app = getFirebaseApp();
	if (!app) return null;
	return getAnalytics(app);
}

export function initAnalytics() {
	if (!analyticsPromise) analyticsPromise = resolveAnalytics();
	return analyticsPromise;
}

export async function trackPageView(path: string) {
	// if (import.meta.env.MODE !== "production") return;
	const analytics = await initAnalytics();

	if (!analytics) return;
	logEvent(analytics, "page_view", {
		page_path: path,
		page_location: window.location.href,
		page_title: document.title,
	});
}
