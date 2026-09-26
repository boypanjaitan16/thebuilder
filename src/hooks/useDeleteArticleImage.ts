import { useMutation } from "@tanstack/react-query";
import { deleteObject, ref } from "firebase/storage";
import { toErrorMessage } from "../lib/errors";
import { getFirebaseStorage } from "../lib/firebaseStorage";

async function deleteArticleImage(url: string | null): Promise<void> {
	if (!url) return;

	const storage = getFirebaseStorage();
	if (!storage) {
		throw new Error("Firebase is not configured.");
	}

	await deleteObject(ref(storage, url));
}

export function useDeleteArticleImage() {
	const mutation = useMutation({ mutationFn: deleteArticleImage });

	return {
		deleteImage: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to delete image.")
			: null,
	};
}
