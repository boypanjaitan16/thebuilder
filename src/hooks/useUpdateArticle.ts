import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { nowIso } from "../lib/date";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { articleKeys } from "../lib/queryKeys";
import type { ArticleValues } from "../schemas/articleSchema";

async function updateArticle(
	id: string,
	values: ArticleValues,
	extra: { cover_image_url?: string | null },
): Promise<void> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	await updateDoc(doc(db, "articles", id), {
		...values,
		cover_image_url: extra.cover_image_url,
		updated_at: nowIso(),
	});
}

export function useUpdateArticle() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({
			id,
			values,
			extra,
		}: {
			id: string;
			values: ArticleValues;
			extra: { cover_image_url?: string | null };
		}) => updateArticle(id, values, extra),
		onSuccess: (_data, { id }) => {
			queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
			queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) });
		},
	});

	return {
		updateArticle: (
			id: string,
			values: ArticleValues,
			extra: { cover_image_url?: string | null },
		) => mutation.mutateAsync({ id, values, extra }),
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to update article.")
			: null,
	};
}
