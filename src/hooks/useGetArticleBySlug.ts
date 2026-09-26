import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { PUBLIC_CONTENT_STALE_TIME } from "../lib/queryClient";
import { articleKeys } from "../lib/queryKeys";
import type { Article } from "../types/Article";

/**
 * Public-safe single-article lookup by slug. Filters to
 * `status == "PUBLISHED"` in the query itself for the same reason as
 * `useGetPublishedArticles` — firestore.rules requires the query to be
 * constrained to published docs for an anonymous read to be allowed.
 */
async function fetchPublishedArticleBySlug(slug: string): Promise<Article> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	let snapshot: Awaited<ReturnType<typeof getDocs>>;
	try {
		snapshot = await getDocs(
			query(
				collection(db, "articles"),
				where("slug", "==", slug),
				where("status", "==", "PUBLISHED"),
				limit(1),
			),
		);
	} catch (err) {
		if (import.meta.env.DEV) {
			// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error in dev, since the UI only ever shows a generic message
			console.error("useGetArticleBySlug:", err);
		}
		throw err;
	}

	const doc = snapshot.docs[0];
	if (!doc) {
		throw new Error("Article not found.");
	}
	return doc.data() as Article;
}

export function useGetArticleBySlug(slug: string | undefined) {
	const articleQuery = useQuery({
		queryKey: articleKeys.bySlug(slug ?? ""),
		queryFn: () => fetchPublishedArticleBySlug(slug as string),
		enabled: !!slug,
		staleTime: PUBLIC_CONTENT_STALE_TIME,
	});

	return {
		data: articleQuery.data ?? null,
		isLoading: articleQuery.isLoading,
		error: articleQuery.error
			? toErrorMessage(articleQuery.error, "Failed to fetch article.")
			: null,
	};
}
