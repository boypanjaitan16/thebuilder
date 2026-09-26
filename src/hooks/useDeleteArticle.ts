import { deleteDoc, doc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";

export function useDeleteArticle() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteArticle = useCallback(async (id: string) => {
		const db = getFirestoreDb();
		if (!db) {
			setError("Firebase is not configured.");
			return { success: false };
		}

		setLoading(true);
		setError(null);
		try {
			await deleteDoc(doc(db, "articles", id));
			return { success: true };
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete article.",
			);
			return { success: false };
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, deleteArticle, setError };
}
