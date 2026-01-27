import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/Product";

export function useGetProducts() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async (): Promise<Product[]> => {
		setLoading(true);
		setError(null);
		const { data, error: fetchError } = await supabase
			.from("products")
			.select("*")
			.order("created_at", { ascending: false });
		setLoading(false);
		if (fetchError) {
			setError(fetchError.message);
			return [];
		}
		return (data || []) as Product[];
	}, []);

	return { loading, error, fetchProducts, setError };
}
