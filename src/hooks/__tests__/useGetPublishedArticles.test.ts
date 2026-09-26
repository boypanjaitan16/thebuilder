import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useGetPublishedArticles } from "../useGetPublishedArticles";

vi.mock("firebase/firestore", () => ({
	collection: vi.fn(),
	getDocs: vi.fn(),
	orderBy: vi.fn(),
	query: vi.fn(),
	where: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";
import type { Article } from "../../types/Article";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockGetDocs = vi.mocked(getDocs);
const mockCollection = vi.mocked(collection);
const mockOrderBy = vi.mocked(orderBy);
const mockQuery = vi.mocked(query);
const mockWhere = vi.mocked(where);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetPublishedArticles", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("fetches only published articles, filtered in the query itself", async () => {
		const mockArticles: Article[] = [
			{
				id: "1",
				title: "Published Article",
				slug: "published-article",
				content: "<p>Body</p>",
				cover_image_url: null,
				status: "PUBLISHED",
				created_at: "2024-01-02",
				updated_at: "2024-01-02",
			},
		];

		mockGetDocs.mockResolvedValue({
			docs: mockArticles.map((article) => ({ data: () => article })),
		} as never);

		const { result } = renderHook(() => useGetPublishedArticles(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockArticles);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "articles");
		expect(mockWhere).toHaveBeenCalledWith("status", "==", "PUBLISHED");
		expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");
		expect(mockQuery).toHaveBeenCalled();
	});

	it("surfaces an error when fetch fails", async () => {
		mockGetDocs.mockRejectedValue(new Error("Fetch failed"));

		const { result } = renderHook(() => useGetPublishedArticles(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBe("Fetch failed");
	});
});
