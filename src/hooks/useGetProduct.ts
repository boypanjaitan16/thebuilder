import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/Product";

export function useGetProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(async (id: string): Promise<Product | null> => {
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
	}, []);

	return { loading, error, fetchProduct, setError };
}
