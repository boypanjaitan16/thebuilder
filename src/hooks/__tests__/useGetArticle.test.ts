import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useGetArticle } from "../useGetArticle";

vi.mock("firebase/firestore", () => ({
	doc: vi.fn(),
	getDoc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";
import type { Article } from "../../types/Article";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockGetDoc = vi.mocked(getDoc);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetArticle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("does not fetch when id is undefined", () => {
		const { result } = renderHook(() => useGetArticle(undefined), {
			wrapper: createQueryWrapper(),
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeNull();
		expect(mockGetDoc).not.toHaveBeenCalled();
	});

	it("fetches article successfully", async () => {
		const mockArticle: Article = {
			id: "valid-id",
			title: "Test Article",
			slug: "test-article",
			content: "<p>Body</p>",
			cover_image_url: "https://example.com/cover.jpg",
			status: "DRAFT",
			created_at: "2024-01-01",
			updated_at: "2024-01-01",
		};

		mockGetDoc.mockResolvedValue({
			exists: () => true,
			data: () => mockArticle,
		} as never);

		const { result } = renderHook(() => useGetArticle("valid-id"), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockArticle);
		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "articles", "valid-id");
	});

	it("surfaces an error when article does not exist", async () => {
		mockGetDoc.mockResolvedValue({ exists: () => false } as never);

		const { result } = renderHook(() => useGetArticle("missing-id"), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toBeNull();
		expect(result.current.error).toBe("Article not found.");
	});

	it("surfaces the fetch error", async () => {
		mockGetDoc.mockRejectedValue(new Error("Not found"));

		const { result } = renderHook(() => useGetArticle("valid-id"), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toBeNull();
		expect(result.current.error).toBe("Not found");
	});
});
