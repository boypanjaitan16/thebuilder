import { useMutation } from "@tanstack/react-query";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { getFirebaseStorage } from "@thebuilder/shared/lib/firebaseStorage";
import { deleteObject, ref } from "firebase/storage";

async function deleteProductThumbnail(url: string | null): Promise<void> {
	if (!url) return;

	const storage = getFirebaseStorage();
	if (!storage) {
		throw new Error("Firebase is not configured.");
	}

	await deleteObject(ref(storage, url));
}

export function useDeleteProductThumbnail() {
	const mutation = useMutation({ mutationFn: deleteProductThumbnail });

	return {
		deleteThumbnail: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to delete thumbnail.")
			: null,
	};
}
