import { useCallback, useState } from "react";
import { env, validateFileUpload } from "../lib/env";
import { supabase } from "../lib/supabaseClient";

export function useUploadProductThumbnail() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadThumbnail = useCallback(async (file: File) => {
		// Validate file before upload
		const validation = validateFileUpload(file);
		if (!validation.valid) {
			setError(validation.error || "Invalid file");
			return { success: false, url: null as string | null };
		}

		setLoading(true);
		setError(null);
		const bucket = env.thumbnailBucket;
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
