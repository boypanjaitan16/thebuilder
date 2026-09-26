import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import { advisoryRequestKeys } from "../lib/queryKeys";
import type { AdvisoryRequest } from "../types/AdvisoryRequest";

async function fetchAllAdvisoryRequests(): Promise<AdvisoryRequest[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snapshot = await getDocs(
		query(collection(db, "advisoryRequests"), orderBy("created_at", "desc")),
	);
	return snapshot.docs.map((doc) => doc.data() as AdvisoryRequest);
}

export function useGetAdvisoryRequests() {
	const requestsQuery = useQuery({
		queryKey: advisoryRequestKeys.list(),
		queryFn: fetchAllAdvisoryRequests,
	});

	return {
		data: requestsQuery.data ?? [],
		isLoading: requestsQuery.isLoading,
		error: requestsQuery.error
			? toErrorMessage(
					requestsQuery.error,
					"Failed to fetch advisory requests.",
				)
			: null,
	};
}
