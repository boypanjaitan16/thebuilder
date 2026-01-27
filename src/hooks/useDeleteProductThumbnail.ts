import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getStoragePathFromPublicUrl } from "../lib/supabaseStorage";

export function useDeleteProductThumbnail() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteThumbnail = useCallback(async (url: string | null) => {
		if (!url) return { success: true };
		const bucket =
			import.meta.env.VITE_SUPABASE_THUMBNAIL_BUCKET || "product-thumbnails";
		const path = getStoragePathFromPublicUrl(url, bucket);
		if (!path) {
			setError("Invalid thumbnail URL.");
			return { success: false };
		}

		setLoading(true);
		setError(null);
		const { error: deleteError } = await supabase.storage
			.from(bucket)
			.remove([path]);
		setLoading(false);

		if (deleteError) {
			setError(deleteError.message);
			return { success: false };
		}

		return { success: true };
	}, []);

	return { deleteThumbnail, loading, error, setError };
}
