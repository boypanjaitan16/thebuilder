import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { nowIso } from "../lib/date";
import { toErrorMessage } from "../lib/errors";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { ApplyFormValues } from "../schemas/applySchema";
import type { AdvisoryRequest } from "../types/AdvisoryRequest";

async function createAdvisoryRequest(
	values: ApplyFormValues,
): Promise<AdvisoryRequest> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const id = crypto.randomUUID();
	const record: AdvisoryRequest = {
		id,
		name: values.name,
		email: values.email,
		role: values.role,
		organization: values.organization,
		size: values.size,
		industry: values.industry,
		situation: values.situation ?? null,
		description: values.description ?? null,
		expectation: values.expectation,
		decisionFlow: values.decisionFlow,
		readiness: values.readiness,
		timeline: values.timeline,
		created_at: nowIso(),
	};
	await setDoc(doc(db, "advisoryRequests", id), record);
	return record;
}

export function useCreateAdvisoryRequest() {
	const mutation = useMutation({ mutationFn: createAdvisoryRequest });

	return {
		createAdvisoryRequest: mutation.mutateAsync,
		isPending: mutation.isPending,
		error: mutation.error
			? toErrorMessage(mutation.error, "Failed to submit request.")
			: null,
	};
}
