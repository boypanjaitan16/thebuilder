import { useMutation } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { validateFileUpload } from "../lib/env";
import { toErrorMessage } from "../lib/errors";
import { getFirebaseStorage } from "../lib/firebaseStorage";

async function uploadArticleImage(file: File): Promise<string> {
	const validation = validateFileUpload(file);
	if (!validation.valid) {
		throw new Error(validation.error || "Invalid file");
	}

	const storage = getFirebaseStorage();
	if (!storage) {
		throw new Error("Firebase is not configured.");
	}

	const fileExt = file.name.split(".").pop();
	const filePath = `articles/${crypto.randomUUID()}.${fileExt || "jpg"}`;
	const storageRef = ref(storage, filePath);
	await uploadBytes(storageRef, file, { contentType: file.type });
	return getDownloadURL(storageRef);
}

export function useUploadArticleImage() {
	const mutation = useMutation({ mutationFn: uploadArticleImage });

	return {
		uploadImage: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to upload image.")
			: null,
	};
}
