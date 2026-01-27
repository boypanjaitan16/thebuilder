import { useCallback, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useDeleteProduct() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteProduct = useCallback(async (id: string) => {
		setLoading(true);
		setError(null);
		const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
		setLoading(false);
		if (deleteError) {
			setError(deleteError.message);
			return { success: false };
		}
		return { success: true };
	}, []);

	return { loading, error, deleteProduct, setError };
}
