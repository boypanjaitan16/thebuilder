import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Article } from "../types/Article";

/**
 * Public-safe article list: explicitly filters to `status == "PUBLISHED"`.
 * This is required, not just a nicety — firestore.rules only allows
 * anonymous reads of published articles, and Firestore's rule engine
 * rejects a collection query outright unless the query itself is
 * constrained to match (an unfiltered query can't be proven to only
 * return docs an anonymous caller may read). Don't reuse the admin-only
 * `useGetArticles` here, which fetches every status for signed-in use.
 */
export function useGetPublishedArticles() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPublishedArticles = useCallback(async (): Promise<Article[]> => {
		const db = getFirestoreDb();
		if (!db) {
			setError("Firebase is not configured.");
			return [];
		}

		setLoading(true);
		setError(null);
		try {
			const snapshot = await getDocs(
				query(
					collection(db, "articles"),
					where("status", "==", "PUBLISHED"),
					orderBy("created_at", "desc"),
				),
			);
			return snapshot.docs.map((doc) => doc.data() as Article);
		} catch (err) {
			if (import.meta.env.DEV) {
				// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error (e.g. "missing index") in dev, since the UI only ever shows a generic message
				console.error("useGetPublishedArticles:", err);
			}
			setError(
				err instanceof Error ? err.message : "Failed to fetch articles.",
			);
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, fetchPublishedArticles, setError };
}
