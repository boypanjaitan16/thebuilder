import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ProductUpdateValues } from "../schemas/productUpdateSchema";

export function useUpdateProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateProduct = useCallback(
		async (id: string, values: ProductUpdateValues, extra: { thumbnail_url?: string | null }) => {
			setLoading(true);
			setError(null);
			const { error: updateError } = await supabase
				.from("products")
				.update({ ...values, thumbnail_url: extra.thumbnail_url })
				.eq("id", id);
			setLoading(false);
			if (updateError) {
				setError(updateError.message);
				return { success: false };
			}
			return { success: true };
		},
		[],
	);

	return { loading, error, updateProduct, setError };
}
