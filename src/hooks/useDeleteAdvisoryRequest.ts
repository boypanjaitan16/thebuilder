import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { advisoryRequestKeys } from "../lib/queryKeys";

async function deleteAdvisoryRequest(id: string): Promise<void> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	await deleteDoc(doc(db, "advisoryRequests", id));
}

export function useDeleteAdvisoryRequest() {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: deleteAdvisoryRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: advisoryRequestKeys.lists() });
		},
	});

	return {
		deleteAdvisoryRequest: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to delete advisory request.")
			: null,
	};
}
