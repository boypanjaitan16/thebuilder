import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { nowIso } from "../lib/date";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { ArticleValues } from "../schemas/articleSchema";

export function useUpdateArticle() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateArticle = useCallback(
		async (
			id: string,
			values: ArticleValues,
			extra: { cover_image_url?: string | null },
		) => {
			const db = getFirestoreDb();
			if (!db) {
				setError("Firebase is not configured.");
				return { success: false };
			}

			setLoading(true);
			setError(null);
			try {
				await updateDoc(doc(db, "articles", id), {
					...values,
					cover_image_url: extra.cover_image_url,
					updated_at: nowIso(),
				});
				return { success: true };
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to update article.",
				);
				return { success: false };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { loading, error, updateArticle, setError };
}
