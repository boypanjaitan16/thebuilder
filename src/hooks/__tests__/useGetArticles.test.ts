import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
const mockGetDocs = vi.mocked(getDocs);
const mockCollection = vi.mocked(collection);
const mockOrderBy = vi.mocked(orderBy);
const mockQuery = vi.mocked(query);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetArticles", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useGetArticles());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.fetchArticles).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("fetches articles successfully", async () => {
		const mockArticles: Article[] = [
			{
				id: "1",
				title: "Article 1",
				slug: "article-1",
				content: "<p>Content 1</p>",
				cover_image_url: "https://example.com/1.jpg",
				status: "PUBLISHED",
				created_at: "2024-01-02",
				updated_at: "2024-01-02",
			},
			{
				id: "2",
				title: "Article 2",
				slug: "article-2",
				content: "<p>Content 2</p>",
				cover_image_url: null,
				status: "DRAFT",
				created_at: "2024-01-01",
				updated_at: "2024-01-01",
			},
		];

		mockGetDocs.mockResolvedValue({
			docs: mockArticles.map((article) => ({ data: () => article })),
		} as never);

		const { result } = renderHook(() => useGetArticles());

		let articles: Article[] = [];
		await act(async () => {
			articles = await result.current.fetchArticles();
		});

		expect(articles).toEqual(mockArticles);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "articles");
		expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");
		expect(mockQuery).toHaveBeenCalled();
	});

	it("returns empty array when Firebase is not configured", async () => {
		mockGetFirestoreDb.mockReturnValue(null);

		const { result } = renderHook(() => useGetArticles());

		let articles: Article[] = [];
		await act(async () => {
			articles = await result.current.fetchArticles();
		});

		expect(articles).toEqual([]);
		expect(result.current.error).toBe("Firebase is not configured.");
	});

	it("handles fetch error", async () => {
		mockGetDocs.mockRejectedValue(new Error("Fetch failed"));

		const { result } = renderHook(() => useGetArticles());

		let articles: Article[] = [];
		await act(async () => {
			articles = await result.current.fetchArticles();
		});

		expect(articles).toEqual([]);
		expect(result.current.error).toBe("Fetch failed");
	});

	it("sets loading state during fetch", async () => {
		let resolveDocs: (value: { docs: [] }) => void;
		const docsPromise = new Promise<{ docs: [] }>((resolve) => {
			resolveDocs = resolve;
		});
		mockGetDocs.mockReturnValue(docsPromise as never);

		const { result } = renderHook(() => useGetArticles());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchArticles();
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveDocs?.({ docs: [] });
			await fetchPromise;
		});

		expect(result.current.loading).toBe(false);
	});

	it("can manually set error", () => {
		const { result } = renderHook(() => useGetArticles());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
