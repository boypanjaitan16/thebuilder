import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useUploadProductThumbnail() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadThumbnail = useCallback(async (file: File) => {
		setLoading(true);
		setError(null);
		const bucket =
			import.meta.env.VITE_SUPABASE_THUMBNAIL_BUCKET || "product-thumbnails";
		const fileExt = file.name.split(".").pop();
		const filePath = `products/${crypto.randomUUID ? crypto.randomUUID() : Date.now()}.${fileExt || "jpg"}`;

		const { data: uploadData, error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(filePath, file, {
				upsert: true,
				contentType: file.type,
			});

		if (uploadError || !uploadData?.path) {
			setLoading(false);
			setError(uploadError?.message || "Failed to upload thumbnail.");
			return { success: false, url: null as string | null };
		}

		const { data: publicUrlData } = supabase.storage
			.from(bucket)
			.getPublicUrl(uploadData.path);
		const publicUrl = publicUrlData?.publicUrl || null;
		setLoading(false);
		return { success: true, url: publicUrl };
	}, []);

	return { uploadThumbnail, loading, error, setError };
}
