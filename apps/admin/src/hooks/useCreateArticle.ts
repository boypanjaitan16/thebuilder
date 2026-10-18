import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nowIso } from "@thebuilder/shared/lib/date";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { getFirestoreDb } from "@thebuilder/shared/lib/firebaseDb";
import { articleKeys } from "@thebuilder/shared/lib/queryKeys";
import type { Article } from "@thebuilder/shared/types/Article";
import { doc, setDoc } from "firebase/firestore";
import type { ArticleValues } from "../schemas/articleSchema";

async function createArticle(
	values: ArticleValues,
	extra: { cover_image_url: string | null },
): Promise<Article> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const id = crypto.randomUUID();
	const now = nowIso();
	const article: Article = {
		id,
		...values,
		cover_image_url: extra.cover_image_url,
		created_at: now,
		updated_at: now,
	};
	await setDoc(doc(db, "articles", id), article);
	return article;
}

export function useCreateArticle() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({
			values,
			extra,
		}: {
			values: ArticleValues;
			extra: { cover_image_url: string | null };
		}) => createArticle(values, extra),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
		},
	});

	return {
		createArticle: (
			values: ArticleValues,
			extra: { cover_image_url: string | null },
		) => mutation.mutateAsync({ values, extra }),
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to create article.")
			: null,
	};
}
