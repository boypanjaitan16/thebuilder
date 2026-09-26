import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { productKeys } from "../lib/queryKeys";
import type { ProductUpdateValues } from "../schemas/productUpdateSchema";

async function updateProduct(
	id: string,
	values: ProductUpdateValues,
	extra: { thumbnail_url?: string | null },
): Promise<void> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	await updateDoc(doc(db, "products", id), {
		...values,
		thumbnail_url: extra.thumbnail_url,
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({
			id,
			values,
			extra,
		}: {
			id: string;
			values: ProductUpdateValues;
			extra: { thumbnail_url?: string | null };
		}) => updateProduct(id, values, extra),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
		},
	});

	return {
		updateProduct: (
			id: string,
			values: ProductUpdateValues,
			extra: { thumbnail_url?: string | null },
		) => mutation.mutateAsync({ id, values, extra }),
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to update product.")
			: null,
	};
}
