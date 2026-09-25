import { deleteDoc, doc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";

export function useDeleteProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteProduct = useCallback(async (id: string) => {
		const db = getFirestoreDb();
		if (!db) {
			setError("Firebase is not configured.");
			return { success: false };
		}

		setLoading(true);
		setError(null);
		try {
			await deleteDoc(doc(db, "products", id));
			return { success: true };
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete product.",
			);
			return { success: false };
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, deleteProduct, setError };
}
