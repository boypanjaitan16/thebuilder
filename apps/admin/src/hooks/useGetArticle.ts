import { useQuery } from "@tanstack/react-query";
import { fetchArticleById } from "@thebuilder/shared/data/admin";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { articleKeys } from "@thebuilder/shared/lib/queryKeys";

export function useGetArticle(id: string | undefined) {
	const articleQuery = useQuery({
		queryKey: articleKeys.detail(id ?? ""),
		queryFn: () => fetchArticleById(id as string),
		enabled: !!id,
	});

	return {
		data: articleQuery.data ?? null,
		isLoading: articleQuery.isLoading,
		error: articleQuery.error
			? toErrorMessage(articleQuery.error, "Failed to fetch article.")
			: null,
	};
}
