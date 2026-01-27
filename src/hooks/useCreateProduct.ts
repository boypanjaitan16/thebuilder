import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ProductCreateValues } from "../schemas/productCreateSchema";

export function useCreateProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createProduct = useCallback(
		async (values: ProductCreateValues, extra: { thumbnail_url: string | null }) => {
			setLoading(true);
			setError(null);
			const { error: insertError } = await supabase.from("products").insert({
				...values,
				thumbnail_url: extra.thumbnail_url,
			});
			setLoading(false);
			if (insertError) {
				setError(insertError.message);
				return { success: false };
			}
			return { success: true };
		},
		[],
	);

	return { loading, error, createProduct, setError };
}
