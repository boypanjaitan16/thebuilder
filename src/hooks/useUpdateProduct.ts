import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { ProductUpdateValues } from "../schemas/productUpdateSchema";

export function useUpdateProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateProduct = useCallback(
		async (
			id: string,
			values: ProductUpdateValues,
			extra: { thumbnail_url?: string | null },
		) => {
			const db = getFirestoreDb();
			if (!db) {
				setError("Firebase is not configured.");
				return { success: false };
			}

			setLoading(true);
			setError(null);
			try {
				await updateDoc(doc(db, "products", id), {
					...values,
					thumbnail_url: extra.thumbnail_url,
				});
				return { success: true };
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to update product.",
				);
				return { success: false };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { loading, error, updateProduct, setError };
}
