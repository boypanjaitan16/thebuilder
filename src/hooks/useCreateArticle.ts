import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { nowIso } from "../lib/date";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { ArticleValues } from "../schemas/articleSchema";

export function useCreateArticle() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createArticle = useCallback(
		async (
			values: ArticleValues,
			extra: { cover_image_url: string | null },
		) => {
			const db = getFirestoreDb();
			if (!db) {
				setError("Firebase is not configured.");
				return { success: false };
			}

			setLoading(true);
			setError(null);
			try {
				const id = crypto.randomUUID();
				const now = nowIso();
				await setDoc(doc(db, "articles", id), {
					id,
					...values,
					cover_image_url: extra.cover_image_url,
					created_at: now,
					updated_at: now,
				});
				return { success: true };
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to create article.",
				);
				return { success: false };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { loading, error, createArticle, setError };
}
