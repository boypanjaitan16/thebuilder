import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useGetArticles } from "../useGetArticles";

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
import type { Article } from "../../types/Article";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockCollection = vi.mocked(collection);
const mockGetDocs = vi.mocked(getDocs);
const mockQuery = vi.mocked(query);
const mockOrderBy = vi.mocked(orderBy);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetArticles", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("fetches articles successfully", async () => {
		const mockArticles: Article[] = [
			{
				id: "1",
				title: "Test Article",
				slug: "test-article",
				content: "<p>Body</p>",
				cover_image_url: null,
				status: "DRAFT",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			},
		];
		mockGetDocs.mockResolvedValue({
			docs: mockArticles.map((article) => ({ data: () => article })),
		} as never);

		const { result } = renderHook(() => useGetArticles(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockArticles);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "articles");
		expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");
		expect(mockQuery).toHaveBeenCalled();
	});

	it("surfaces an error when fetch fails", async () => {
		mockGetDocs.mockRejectedValue(new Error("Failed"));

		const { result } = renderHook(() => useGetArticles(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBe("Failed");
	});
});
