import type { Article } from "@thebuilder/shared/types/Article";
import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
	collection,
	getDocs,
	getFirestore,
	orderBy,
	query,
	where,
} from "firebase/firestore";

/**
 * The public Article shape, so build-time data can seed the client's
 * article queries during prerender (see vite-plugins/prerender.ts).
 */
export type BuildTimeArticle = Article;

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
		if (process.env.REQUIRE_PUBLISHED_ARTICLES === "true") {
			throw new Error(
				"Firebase config is required for production prerendering.",
			);
		}
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
				id: doc.id,
				title: data.title as string,
				slug: data.slug as string,
				content: data.content as string,
				cover_image_url: (data.cover_image_url as string | null) ?? null,
				status: "PUBLISHED",
				// Articles saved before the language field existed are Indonesian.
				language: data.language === "en" ? "en" : "id",
				created_at: data.created_at as string,
				updated_at: data.updated_at as string,
			};
		});
	} catch (err) {
		if (process.env.REQUIRE_PUBLISHED_ARTICLES === "true") throw err;
		// biome-ignore lint/suspicious/noConsole: build-time diagnostic, not app code
		console.error(
			"[build] Failed to fetch published articles for prerendering/sitemap:",
			err,
		);
		return [];
	}
}
