import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

	it("initializes with default state", () => {
		const { result } = renderHook(() => useGetArticle());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.fetchArticle).toBe("function");
		expect(typeof result.current.setError).toBe("function");
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

		const { result } = renderHook(() => useGetArticle());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticle("valid-id");
		});

		expect(article).toEqual(mockArticle);
		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "articles", "valid-id");
	});

	it("returns null and sets error when article does not exist", async () => {
		mockGetDoc.mockResolvedValue({ exists: () => false } as never);

		const { result } = renderHook(() => useGetArticle());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticle("missing-id");
		});

		expect(article).toBeNull();
		expect(result.current.error).toBe("Article not found.");
	});

	it("handles fetch error", async () => {
		mockGetDoc.mockRejectedValue(new Error("Not found"));

		const { result } = renderHook(() => useGetArticle());

		let article: Article | null = null;
		await act(async () => {
			article = await result.current.fetchArticle("valid-id");
		});

		expect(article).toBeNull();
		expect(result.current.error).toBe("Not found");
	});

	it("sets loading state during fetch", async () => {
		let resolveGetDoc: (value: { exists: () => boolean }) => void;
		const getDocPromise = new Promise<{ exists: () => boolean }>((resolve) => {
			resolveGetDoc = resolve;
		});
		mockGetDoc.mockReturnValue(getDocPromise as never);

		const { result } = renderHook(() => useGetArticle());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchArticle("valid-id");
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveGetDoc?.({ exists: () => false });
			await fetchPromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
