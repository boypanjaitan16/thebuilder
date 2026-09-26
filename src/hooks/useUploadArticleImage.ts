import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useState } from "react";
import { validateFileUpload } from "../lib/env";
import { getFirebaseStorage } from "../lib/firebaseStorage";

export function useUploadArticleImage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadImage = useCallback(async (file: File) => {
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
			const filePath = `articles/${crypto.randomUUID()}.${fileExt || "jpg"}`;
			const storageRef = ref(storage, filePath);
			await uploadBytes(storageRef, file, { contentType: file.type });
			const url = await getDownloadURL(storageRef);
			return { success: true, url };
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to upload image.");
			return { success: false, url: null as string | null };
		} finally {
			setLoading(false);
		}
	}, []);

	return { uploadImage, loading, error, setError };
}
