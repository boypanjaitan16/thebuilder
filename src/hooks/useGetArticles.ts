import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Article } from "../types/Article";

export function useGetArticles() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchArticles = useCallback(async (): Promise<Article[]> => {
		const db = getFirestoreDb();
		if (!db) {
			setError("Firebase is not configured.");
			return [];
		}

		setLoading(true);
		setError(null);
		try {
			const snapshot = await getDocs(
				query(collection(db, "articles"), orderBy("created_at", "desc")),
			);
			return snapshot.docs.map((doc) => doc.data() as Article);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch articles.",
			);
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, fetchArticles, setError };
}
