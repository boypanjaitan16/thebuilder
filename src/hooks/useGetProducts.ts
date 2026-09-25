import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Product } from "../types/Product";

export function useGetProducts() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async (): Promise<Product[]> => {
		const db = getFirestoreDb();
		if (!db) {
			setError("Firebase is not configured.");
			return [];
		}

		setLoading(true);
		setError(null);
		try {
			const snapshot = await getDocs(
				query(collection(db, "products"), orderBy("created_at", "desc")),
			);
			return snapshot.docs.map((doc) => doc.data() as Product);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch products.",
			);
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, error, fetchProducts, setError };
}
