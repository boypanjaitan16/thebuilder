import { useQuery } from "@tanstack/react-query";
import { fetchAllArticles } from "@thebuilder/shared/data/admin";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { articleKeys } from "@thebuilder/shared/lib/queryKeys";

export function useGetArticles() {
	const articlesQuery = useQuery({
		queryKey: articleKeys.adminList(),
		queryFn: fetchAllArticles,
	});

	return {
		data: articlesQuery.data ?? [],
		isLoading: articlesQuery.isLoading,
		error: articlesQuery.error
			? toErrorMessage(articlesQuery.error, "Failed to fetch articles.")
			: null,
	};
}
