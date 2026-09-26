import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateArticle } from "../useUpdateArticle";

vi.mock("firebase/firestore", () => ({
	doc: vi.fn(),
	updateDoc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { doc, updateDoc } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockUpdateDoc = vi.mocked(updateDoc);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useUpdateArticle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useUpdateArticle());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.updateArticle).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("updates article successfully", async () => {
		mockUpdateDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useUpdateArticle());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.updateArticle(
				"article-id-123",
				{
					title: "Updated Article",
					slug: "updated-article",
					content: "<p>Updated body</p>",
					status: "PUBLISHED",
				},
				{ cover_image_url: "https://example.com/new-cover.jpg" },
			);
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "articles", "article-id-123");
		expect(mockUpdateDoc).toHaveBeenCalledWith(
			undefined,
			expect.objectContaining({
				title: "Updated Article",
				slug: "updated-article",
				content: "<p>Updated body</p>",
				status: "PUBLISHED",
				cover_image_url: "https://example.com/new-cover.jpg",
				updated_at: expect.any(String),
			}),
		);
	});

	it("handles error when updating article fails", async () => {
		mockUpdateDoc.mockRejectedValue(new Error("Update failed"));

		const { result } = renderHook(() => useUpdateArticle());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.updateArticle(
				"article-id-123",
				{
					title: "Updated Article",
					slug: "updated-article",
					content: "<p>Body</p>",
					status: "DRAFT",
				},
				{ cover_image_url: null },
			);
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Update failed");
	});

	it("sets loading state during update", async () => {
		let resolveUpdate: () => void;
		const updatePromise = new Promise<void>((resolve) => {
			resolveUpdate = resolve;
		});
		mockUpdateDoc.mockReturnValue(updatePromise);

		const { result } = renderHook(() => useUpdateArticle());

		expect(result.current.loading).toBe(false);

		let callPromise: Promise<{ success: boolean }>;
		act(() => {
			callPromise = result.current.updateArticle(
				"article-id-123",
				{
					title: "Test",
					slug: "test",
					content: "<p>Body</p>",
					status: "DRAFT",
				},
				{ cover_image_url: null },
			);
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveUpdate?.();
			await callPromise;
		});

		expect(result.current.loading).toBe(false);
	});

	it("can manually set error", () => {
		const { result } = renderHook(() => useUpdateArticle());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
