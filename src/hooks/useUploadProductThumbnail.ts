import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";
import { validateFileUpload } from "../lib/env";
import { getFirebaseStorage } from "../lib/firebaseStorage";

export function useUploadProductThumbnail() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadThumbnail = useCallback(async (file: File) => {
		const validation = validateFileUpload(file);
		if (!validation.valid) {
			setError(validation.error || "Invalid file");
			return { success: false, url: null as string | null };
		}

		const storage = getFirebaseStorage();
		if (!storage) {
			setError("Firebase is not configured.");
			return { success: false, url: null as string | null };
		}

		setLoading(true);
		setError(null);
		try {
			const fileExt = file.name.split(".").pop();
			const filePath = `products/${crypto.randomUUID()}.${fileExt || "jpg"}`;
			const storageRef = ref(storage, filePath);
			await uploadBytes(storageRef, file, { contentType: file.type });
			const url = await getDownloadURL(storageRef);
			return { success: true, url };
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to upload thumbnail.",
			);
			return { success: false, url: null as string | null };
		} finally {
			setLoading(false);
		}
	}, []);

	return { uploadThumbnail, loading, error, setError };
}
