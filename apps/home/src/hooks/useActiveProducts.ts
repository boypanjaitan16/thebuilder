import { useQuery } from "@tanstack/react-query";
import { fetchActiveProducts } from "@thebuilder/shared/data/public";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { isPrerendering } from "@thebuilder/shared/lib/prerender";
import { PUBLIC_CONTENT_STALE_TIME } from "@thebuilder/shared/lib/queryClient";
import { productKeys } from "@thebuilder/shared/lib/queryKeys";

/**
 * Public-safe product list: explicitly filters to `status == "ACTIVE"`.
 * This is required, not just a nicety — firestore.rules only allows
 * anonymous reads of active products, and Firestore's rule engine
 * rejects a collection query outright unless the query itself is
 * constrained to match (an unfiltered query can't be proven to only
 * return docs an anonymous caller may read). Don't reuse the admin-only
 * `useGetProducts` here, which fetches every status for signed-in use.
 */
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
