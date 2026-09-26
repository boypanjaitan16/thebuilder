import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { nowIso } from "../lib/date";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { productKeys } from "../lib/queryKeys";
import type { ProductCreateValues } from "../schemas/productCreateSchema";
import type { Product } from "../types/Product";

async function createProduct(
	values: ProductCreateValues,
	extra: { thumbnail_url: string | null },
): Promise<Product> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const id = crypto.randomUUID();
	const product = {
		id,
		...values,
		thumbnail_url: extra.thumbnail_url,
		created_at: nowIso(),
	} as Product;
	await setDoc(doc(db, "products", id), product);
	return product;
}

export function useCreateProduct() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({
			values,
			extra,
		}: {
			values: ProductCreateValues;
			extra: { thumbnail_url: string | null };
		}) => createProduct(values, extra),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
		},
	});

	return {
		createProduct: (
			values: ProductCreateValues,
			extra: { thumbnail_url: string | null },
		) => mutation.mutateAsync({ values, extra }),
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to create product.")
			: null,
	};
}
