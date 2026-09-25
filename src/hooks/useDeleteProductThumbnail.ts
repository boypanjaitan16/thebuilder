import { deleteObject, ref } from "firebase/storage";
import { useCallback, useState } from "react";
import { getFirebaseStorage } from "../lib/firebaseStorage";

export function useDeleteProductThumbnail() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteThumbnail = useCallback(async (url: string | null) => {
		if (!url) return { success: true };

		const storage = getFirebaseStorage();
		if (!storage) {
			setError("Firebase is not configured.");
			return { success: false };
		}

		setLoading(true);
		setError(null);
		try {
			await deleteObject(ref(storage, url));
			return { success: true };
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete thumbnail.",
			);
			return { success: false };
		} finally {
			setLoading(false);
		}
	}, []);

	return { deleteThumbnail, loading, error, setError };
}
