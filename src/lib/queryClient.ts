import { QueryClient } from "@tanstack/react-query";

export const PUBLIC_CONTENT_STALE_TIME = 5 * 60_000;

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60_000,
			gcTime: 5 * 60_000,
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 0,
		},
	},
});
