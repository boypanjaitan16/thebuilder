import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { articleKeys } from "../lib/queryKeys";
import type { Article } from "../types/Article";

async function fetchAllArticles(): Promise<Article[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snapshot = await getDocs(
		query(collection(db, "articles"), orderBy("created_at", "desc")),
	);
	return snapshot.docs.map((doc) => doc.data() as Article);
}

export function useGetArticles() {
	const articlesQuery = useQuery({
		queryKey: articleKeys.adminList(),
		queryFn: fetchAllArticles,
	});

	return {
		data: articlesQuery.data ?? [],
		isLoading: articlesQuery.isLoading,
		error: articlesQuery.error
			? toErrorMessage(articlesQuery.error, "Failed to fetch articles.")
			: null,
	};
}
