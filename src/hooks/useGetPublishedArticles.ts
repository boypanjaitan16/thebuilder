import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { PUBLIC_CONTENT_STALE_TIME } from "../lib/queryClient";
import { articleKeys } from "../lib/queryKeys";
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
async function fetchPublishedArticles(): Promise<Article[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

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
		throw err;
	}
}

export function useGetPublishedArticles() {
	const articlesQuery = useQuery({
		queryKey: articleKeys.publishedList(),
		queryFn: fetchPublishedArticles,
		staleTime: PUBLIC_CONTENT_STALE_TIME,
	});

	return {
		data: articlesQuery.data ?? [],
		isLoading: articlesQuery.isLoading,
		error: articlesQuery.error
			? toErrorMessage(articlesQuery.error, "Failed to fetch articles.")
			: null,
	};
}
