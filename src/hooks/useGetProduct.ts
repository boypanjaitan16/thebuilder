import { useCallback, useState } from "react";
import { isValidUUID } from "../lib/env";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/Product";

export function useGetProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(
		async (id: string): Promise<Product | null> => {
			if (!isValidUUID(id)) {
				setError("Invalid product ID format");
				return null;
			}

			setLoading(true);
			setError(null);
			const { data, error: fetchError } = await supabase
				.from("products")
				.select("*")
				.eq("id", id)
				.single();
			setLoading(false);
			if (fetchError) {
				setError(fetchError.message);
				return null;
			}
			return (data || null) as Product | null;
		},
		[],
	);

	return { loading, error, fetchProduct, setError };
}
