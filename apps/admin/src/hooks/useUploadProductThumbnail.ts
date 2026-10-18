import { useMutation } from "@tanstack/react-query";
import { validateFileUpload } from "@thebuilder/shared/lib/env";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { getFirebaseStorage } from "@thebuilder/shared/lib/firebaseStorage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function uploadProductThumbnail(file: File): Promise<string> {
	const validation = validateFileUpload(file);
	if (!validation.valid) {
		throw new Error(validation.error || "Invalid file");
	}

	const storage = getFirebaseStorage();
	if (!storage) {
		throw new Error("Firebase is not configured.");
	}

	const fileExt = file.name.split(".").pop();
	const filePath = `products/${crypto.randomUUID()}.${fileExt || "jpg"}`;
	const storageRef = ref(storage, filePath);
	await uploadBytes(storageRef, file, { contentType: file.type });
	return getDownloadURL(storageRef);
}

export function useUploadProductThumbnail() {
	const mutation = useMutation({ mutationFn: uploadProductThumbnail });

	return {
		uploadThumbnail: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to upload thumbnail.")
			: null,
	};
}
