import { useQuery } from "@tanstack/react-query";
import { fetchAllAdvisoryRequests } from "@thebuilder/shared/data/admin";
import { toErrorMessage } from "@thebuilder/shared/lib/errors";
import { advisoryRequestKeys } from "@thebuilder/shared/lib/queryKeys";

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
