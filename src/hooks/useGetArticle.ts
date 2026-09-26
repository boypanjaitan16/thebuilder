import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Article } from "../types/Article";

export function useGetArticle() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchArticle = useCallback(
		async (id: string): Promise<Article | null> => {
			const db = getFirestoreDb();
			if (!db) {
				setError("Firebase is not configured.");
				return null;
			}

			setLoading(true);
			setError(null);
			try {
				const snap = await getDoc(doc(db, "articles", id));
				if (!snap.exists()) {
					setError("Article not found.");
					return null;
				}
				return snap.data() as Article;
			} catch (err) {
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

	return { loading, error, fetchArticle, setError };
}
