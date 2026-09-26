import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { PUBLIC_CONTENT_STALE_TIME } from "../lib/queryClient";
import { productKeys } from "../lib/queryKeys";
import type { Product } from "../types/Product";

async function fetchAllProducts(): Promise<Product[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snapshot = await getDocs(
		query(collection(db, "products"), orderBy("created_at", "desc")),
	);
	return snapshot.docs.map((doc) => doc.data() as Product);
}

export function useGetProducts() {
	const productsQuery = useQuery({
		queryKey: productKeys.list(),
		queryFn: fetchAllProducts,
		staleTime: PUBLIC_CONTENT_STALE_TIME,
	});

	return {
		data: productsQuery.data ?? [],
		isLoading: productsQuery.isLoading,
		error: productsQuery.error
			? toErrorMessage(productsQuery.error, "Failed to fetch products.")
			: null,
	};
}
