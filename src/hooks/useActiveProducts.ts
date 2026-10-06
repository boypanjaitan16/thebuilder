import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { isPrerendering } from "../lib/prerender";
import { PUBLIC_CONTENT_STALE_TIME } from "../lib/queryClient";
import { productKeys } from "../lib/queryKeys";
import type { Product } from "../types/Product";

/**
 * Public-safe product list: explicitly filters to `status == "ACTIVE"`.
 * This is required, not just a nicety — firestore.rules only allows
 * anonymous reads of active products, and Firestore's rule engine
 * rejects a collection query outright unless the query itself is
 * constrained to match (an unfiltered query can't be proven to only
 * return docs an anonymous caller may read). Don't reuse the admin-only
 * `useGetProducts` here, which fetches every status for signed-in use.
 */
async function fetchActiveProducts(): Promise<Product[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	try {
		const snapshot = await getDocs(
			query(
				collection(db, "products"),
				where("status", "==", "ACTIVE"),
				orderBy("created_at", "desc"),
			),
		);
		return snapshot.docs.map((doc) => doc.data() as Product);
	} catch (err) {
		if (import.meta.env.DEV) {
			// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error (e.g. "missing index") in dev, since the UI only ever shows a generic message
			console.error("useActiveProducts:", err);
		}
		throw err;
	}
}

export function useActiveProducts() {
	const productsQuery = useQuery({
		queryKey: productKeys.publishedList(),
		queryFn: fetchActiveProducts,
		staleTime: PUBLIC_CONTENT_STALE_TIME,
		// No App Check token during prerender, so the read would fail under
		// enforcement — skip it and prerender the loading state instead.
		enabled: !isPrerendering(),
	});

	return {
		data: productsQuery.data ?? [],
		isLoading: productsQuery.isLoading || isPrerendering(),
		error: productsQuery.error
			? toErrorMessage(productsQuery.error, "Failed to fetch products.")
			: null,
	};
}
