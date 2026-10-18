import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@thebuilder/shared/data/admin";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { PUBLIC_CONTENT_STALE_TIME } from "@thebuilder/shared/lib/queryClient";
import { productKeys } from "@thebuilder/shared/lib/queryKeys";

export function useGetProducts() {
	const productsQuery = useQuery({
		queryKey: productKeys.adminList(),
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
