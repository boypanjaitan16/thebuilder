import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { articleKeys } from "../lib/queryKeys";
import type { Article } from "../types/Article";

async function fetchArticleById(id: string): Promise<Article> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snap = await getDoc(doc(db, "articles", id));
	if (!snap.exists()) {
		throw new Error("Article not found.");
	}
	return snap.data() as Article;
}

export function useGetArticle(id: string | undefined) {
	const articleQuery = useQuery({
		queryKey: articleKeys.detail(id ?? ""),
		queryFn: () => fetchArticleById(id as string),
		enabled: !!id,
	});

	return {
		data: articleQuery.data ?? null,
		isLoading: articleQuery.isLoading,
		error: articleQuery.error
			? toErrorMessage(articleQuery.error, "Failed to fetch article.")
			: null,
	};
}
