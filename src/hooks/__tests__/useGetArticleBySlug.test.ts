import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

	it("initializes with default state", () => {
		const { result } = renderHook(() => useGetArticleBySlug());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.fetchArticleBySlug).toBe("function");
		expect(typeof result.current.setError).toBe("function");
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

		const { result } = renderHook(() => useGetArticleBySlug());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticleBySlug("test-article");
		});

		expect(article).toEqual(mockArticle);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "articles");
		expect(mockWhere).toHaveBeenCalledWith("slug", "==", "test-article");
		expect(mockWhere).toHaveBeenCalledWith("status", "==", "PUBLISHED");
		expect(mockLimit).toHaveBeenCalledWith(1);
		expect(mockQuery).toHaveBeenCalled();
	});

	it("returns null and sets error when no article matches", async () => {
		mockGetDocs.mockResolvedValue({ docs: [] } as never);

		const { result } = renderHook(() => useGetArticleBySlug());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticleBySlug("missing-slug");
		});

		expect(article).toBeNull();
		expect(result.current.error).toBe("Article not found.");
	});

	it("returns null when Firebase is not configured", async () => {
		mockGetFirestoreDb.mockReturnValue(null);

		const { result } = renderHook(() => useGetArticleBySlug());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticleBySlug("test-article");
		});

		expect(article).toBeNull();
		expect(result.current.error).toBe("Firebase is not configured.");
	});

	it("handles fetch error", async () => {
		mockGetDocs.mockRejectedValue(new Error("Fetch failed"));

		const { result } = renderHook(() => useGetArticleBySlug());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticleBySlug("test-article");
		});

		expect(article).toBeNull();
		expect(result.current.error).toBe("Fetch failed");
	});

	it("sets loading state during fetch", async () => {
		let resolveDocs: (value: { docs: [] }) => void;
		const docsPromise = new Promise<{ docs: [] }>((resolve) => {
			resolveDocs = resolve;
		});
		mockGetDocs.mockReturnValue(docsPromise as never);

		const { result } = renderHook(() => useGetArticleBySlug());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchArticleBySlug("test-article");
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveDocs?.({ docs: [] });
			await fetchPromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
