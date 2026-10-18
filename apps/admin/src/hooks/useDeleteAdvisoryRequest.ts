import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { getFirestoreDb } from "@thebuilder/shared/lib/firebaseDb";
import { advisoryRequestKeys } from "@thebuilder/shared/lib/queryKeys";
import { deleteDoc, doc } from "firebase/firestore";

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
