import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Article } from "../types/Article";

/**
 * Public-safe single-article lookup by slug. Filters to
 * `status == "PUBLISHED"` in the query itself for the same reason as
 * `useGetPublishedArticles` — firestore.rules requires the query to be
 * constrained to published docs for an anonymous read to be allowed.
 */
export function useGetArticleBySlug() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchArticleBySlug = useCallback(
		async (slug: string): Promise<Article | null> => {
			const db = getFirestoreDb();
			if (!db) {
				setError("Firebase is not configured.");
				return null;
			}

			setLoading(true);
			setError(null);
			try {
				const snapshot = await getDocs(
					query(
						collection(db, "articles"),
						where("slug", "==", slug),
						where("status", "==", "PUBLISHED"),
						limit(1),
					),
				);
				const doc = snapshot.docs[0];
				if (!doc) {
					setError("Article not found.");
					return null;
				}
				return doc.data() as Article;
			} catch (err) {
				if (import.meta.env.DEV) {
					// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error in dev, since the UI only ever shows a generic message
					console.error("useGetArticleBySlug:", err);
				}
				setError(
					err instanceof Error ? err.message : "Failed to fetch article.",
				);
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { loading, error, fetchArticleBySlug, setError };
}
