import { useQuery } from "@tanstack/react-query";
import { fetchPublishedArticles } from "@thebuilder/shared/data/public";
import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { isPrerendering } from "@thebuilder/shared/lib/prerender";
import { PUBLIC_CONTENT_STALE_TIME } from "@thebuilder/shared/lib/queryClient";
import { articleKeys } from "@thebuilder/shared/lib/queryKeys";

/**
 * Public-safe article list: explicitly filters to `status == "PUBLISHED"`.
 * This is required, not just a nicety — firestore.rules only allows
 * anonymous reads of published articles, and Firestore's rule engine
 * rejects a collection query outright unless the query itself is
 * constrained to match (an unfiltered query can't be proven to only
 * return docs an anonymous caller may read). Don't reuse the admin-only
 * `useGetArticles` here, which fetches every status for signed-in use.
 * Also scoped to the current URL language: `/insights` lists ID articles,
 * `/en/insights` lists EN ones.
 */
export function useGetPublishedArticles() {
	const { language } = useI18n();
	const articlesQuery = useQuery({
		queryKey: articleKeys.publishedList(language),
		queryFn: () => fetchPublishedArticles(language),
		staleTime: PUBLIC_CONTENT_STALE_TIME,
		// No App Check token during prerender, so the read would fail under
		// enforcement — skip it and prerender the loading state instead.
		enabled: !isPrerendering(),
	});

	return {
		data: articlesQuery.data ?? [],
		isLoading: articlesQuery.isLoading || isPrerendering(),
		error: articlesQuery.error
			? toErrorMessage(articlesQuery.error, "Failed to fetch articles.")
			: null,
	};
}
