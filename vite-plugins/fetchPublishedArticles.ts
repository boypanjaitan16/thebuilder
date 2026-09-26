import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
	collection,
	getDocs,
	getFirestore,
	orderBy,
	query,
	where,
} from "firebase/firestore";

export type BuildTimeArticle = {
	slug: string;
	title: string;
	content: string;
	cover_image_url: string | null;
	updated_at: string;
};

export type BuildTimeFirebaseEnv = {
	apiKey?: string;
	authDomain?: string;
	projectId?: string;
	storageBucket?: string;
	messagingSenderId?: string;
	appId?: string;
	measurementId?: string;
};

/**
 * Build-time equivalent of useGetPublishedArticles, for use from
 * vite.config.ts (Node context — no import.meta.env, can't reuse
 * src/lib/firebase.ts). Same where("status","==","PUBLISHED") constraint
 * as the client hook: firestore.rules requires it for an anonymous
 * collection query to be allowed at all. Degrades to [] (never throws) so
 * a missing .env or a transient Firestore error never fails `vite build`.
 */
export async function fetchPublishedArticlesForBuild(
	env: BuildTimeFirebaseEnv,
): Promise<BuildTimeArticle[]> {
	const hasConfig =
		Boolean(env.apiKey) && Boolean(env.projectId) && Boolean(env.appId);
	if (!hasConfig) {
		// biome-ignore lint/suspicious/noConsole: build-time diagnostic, not app code
		console.warn(
			"[build] Firebase config incomplete — skipping article prerendering and sitemap entries.",
		);
		return [];
	}

	try {
		const app: FirebaseApp = getApps()[0] ?? initializeApp(env);
		const db = getFirestore(app);
		const snapshot = await getDocs(
			query(
				collection(db, "articles"),
				where("status", "==", "PUBLISHED"),
				orderBy("created_at", "desc"),
			),
		);
		return snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				slug: data.slug as string,
				title: data.title as string,
				content: data.content as string,
				cover_image_url: (data.cover_image_url as string | null) ?? null,
				updated_at: data.updated_at as string,
			};
		});
	} catch (err) {
		// biome-ignore lint/suspicious/noConsole: build-time diagnostic, not app code
		console.error(
			"[build] Failed to fetch published articles for prerendering/sitemap:",
			err,
		);
		return [];
	}
}
