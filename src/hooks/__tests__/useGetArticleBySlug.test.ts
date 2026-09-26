import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useGetArticleBySlug } from "../useGetArticleBySlug";

vi.mock("firebase/firestore", () => ({
	collection: vi.fn(),
	getDocs: vi.fn(),
	limit: vi.fn(),
	query: vi.fn(),
	where: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";
import type { Article } from "../../types/Article";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockGetDocs = vi.mocked(getDocs);
const mockCollection = vi.mocked(collection);
const mockQuery = vi.mocked(query);
const mockWhere = vi.mocked(where);
const mockLimit = vi.mocked(limit);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetArticleBySlug", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("does not fetch when slug is undefined", () => {
		const { result } = renderHook(() => useGetArticleBySlug(undefined), {
			wrapper: createQueryWrapper(),
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeNull();
		expect(mockGetDocs).not.toHaveBeenCalled();
	});

	it("fetches a published article by slug", async () => {
		const mockArticle: Article = {
			id: "1",
			title: "Test Article",
			slug: "test-article",
			content: "<p>Body</p>",
			cover_image_url: null,
			status: "PUBLISHED",
			created_at: "2024-01-01",
			updated_at: "2024-01-01",
		};

		mockGetDocs.mockResolvedValue({
			docs: [{ data: () => mockArticle }],
		} as never);

		const { result } = renderHook(() => useGetArticleBySlug("test-article"), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockArticle);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "articles");
		expect(mockWhere).toHaveBeenCalledWith("slug", "==", "test-article");
		expect(mockWhere).toHaveBeenCalledWith("status", "==", "PUBLISHED");
		expect(mockLimit).toHaveBeenCalledWith(1);
		expect(mockQuery).toHaveBeenCalled();
	});

	it("surfaces an error when no article matches", async () => {
		mockGetDocs.mockResolvedValue({ docs: [] } as never);

		const { result } = renderHook(() => useGetArticleBySlug("missing-slug"), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toBeNull();
		expect(result.current.error).toBe("Article not found.");
	});

	it("surfaces the fetch error", async () => {
		mockGetDocs.mockRejectedValue(new Error("Fetch failed"));

		const { result } = renderHook(() => useGetArticleBySlug("test-article"), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toBeNull();
		expect(result.current.error).toBe("Fetch failed");
	});
});
