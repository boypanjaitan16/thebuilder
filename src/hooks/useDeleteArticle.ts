import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { articleKeys } from "../lib/queryKeys";

async function deleteArticle(id: string): Promise<void> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	await deleteDoc(doc(db, "articles", id));
}

export function useDeleteArticle() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: deleteArticle,
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
			queryClient.removeQueries({ queryKey: articleKeys.detail(id) });
		},
	});

	return {
		deleteArticle: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to delete article.")
			: null,
	};
}
