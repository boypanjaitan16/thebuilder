import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { nowIso } from "../lib/date";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { articleKeys } from "../lib/queryKeys";
import type { ArticleValues } from "../schemas/articleSchema";
import type { Article } from "../types/Article";

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
