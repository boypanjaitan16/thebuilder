import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { ProductCreateValues } from "../schemas/productCreateSchema";

export function useCreateProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createProduct = useCallback(
		async (
			values: ProductCreateValues,
			extra: { thumbnail_url: string | null },
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
				await setDoc(doc(db, "products", id), {
					id,
					...values,
					thumbnail_url: extra.thumbnail_url,
					created_at: new Date().toISOString(),
				});
				return { success: true };
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to create product.",
				);
				return { success: false };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { loading, error, createProduct, setError };
}
