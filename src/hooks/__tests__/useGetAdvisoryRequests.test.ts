import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useGetAdvisoryRequests } from "../useGetAdvisoryRequests";

vi.mock("firebase/firestore", () => ({
	collection: vi.fn(),
	getDocs: vi.fn(),
	orderBy: vi.fn(),
	query: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";
import type { AdvisoryRequest } from "../../types/AdvisoryRequest";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockCollection = vi.mocked(collection);
const mockGetDocs = vi.mocked(getDocs);
const mockQuery = vi.mocked(query);
const mockOrderBy = vi.mocked(orderBy);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetAdvisoryRequests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("fetches advisory requests successfully", async () => {
		const mockRequests: AdvisoryRequest[] = [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				role: "CEO",
				organization: "Acme Inc",
				size: "100-500",
				industry: "Technology",
				situation: null,
				description: null,
				expectation: "Growth strategy",
				decisionFlow: "Board approval",
				readiness: "Ready to start",
				timeline: "Q1 2024",
				created_at: "2024-01-01",
			},
		];
		mockGetDocs.mockResolvedValue({
			docs: mockRequests.map((request) => ({ data: () => request })),
		} as never);

		const { result } = renderHook(() => useGetAdvisoryRequests(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockRequests);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "advisoryRequests");
		expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");
		expect(mockQuery).toHaveBeenCalled();
	});

	it("surfaces an error when fetch fails", async () => {
		mockGetDocs.mockRejectedValue(new Error("Failed"));

		const { result } = renderHook(() => useGetAdvisoryRequests(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBe("Failed");
	});
});
