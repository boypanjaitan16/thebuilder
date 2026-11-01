import { useQuery } from "@tanstack/react-query";
import { fetchPublishedArticleBySlug } from "@thebuilder/shared/data/public";
import { useI18n } from "@thebuilder/shared/i18n/I18nProvider";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { isPrerendering } from "@thebuilder/shared/lib/prerender";
import { PUBLIC_CONTENT_STALE_TIME } from "@thebuilder/shared/lib/queryClient";
import { articleKeys } from "@thebuilder/shared/lib/queryKeys";

/**
 * Public-safe single-article lookup by slug. Filters to
 * `status == "PUBLISHED"` in the query itself for the same reason as
 * `useGetPublishedArticles` — firestore.rules requires the query to be
 * constrained to published docs for an anonymous read to be allowed.
 * The URL language picks which article a slug resolves to.
 */
export function useGetArticleBySlug(slug: string | undefined) {
	const { language } = useI18n();
	const articleQuery = useQuery({
		queryKey: articleKeys.bySlug(slug ?? "", language),
		queryFn: () => fetchPublishedArticleBySlug(slug as string, language),
		enabled: !!slug && !isPrerendering(),
		staleTime: PUBLIC_CONTENT_STALE_TIME,
	});

	return {
		data: articleQuery.data ?? null,
		isLoading: articleQuery.isLoading || isPrerendering(),
		error: articleQuery.error
			? toErrorMessage(articleQuery.error, "Failed to fetch article.")
			: null,
	};
}
