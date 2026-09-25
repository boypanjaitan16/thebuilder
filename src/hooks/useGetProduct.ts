import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { isValidUUID } from "../lib/env";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Product } from "../types/Product";

export function useGetProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(
		async (id: string): Promise<Product | null> => {
			if (!isValidUUID(id)) {
				setError("Invalid product ID format");
				return null;
			}

			const db = getFirestoreDb();
			if (!db) {
				setError("Firebase is not configured.");
				return null;
			}

			setLoading(true);
			setError(null);
			try {
				const snap = await getDoc(doc(db, "products", id));
				if (!snap.exists()) {
					setError("Product not found.");
					return null;
				}
				return snap.data() as Product;
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch product.",
				);
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return { loading, error, fetchProduct, setError };
}
