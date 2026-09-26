import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteArticle } from "../useDeleteArticle";

vi.mock("firebase/firestore", () => ({
	deleteDoc: vi.fn(),
	doc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { deleteDoc, doc } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockDeleteDoc = vi.mocked(deleteDoc);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useDeleteArticle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useDeleteArticle());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.deleteArticle).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("deletes article successfully", async () => {
		mockDeleteDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useDeleteArticle());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteArticle("article-id-123");
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "articles", "article-id-123");
		expect(mockDeleteDoc).toHaveBeenCalled();
	});

	it("handles error when deleting article fails", async () => {
		mockDeleteDoc.mockRejectedValue(new Error("Delete failed"));

		const { result } = renderHook(() => useDeleteArticle());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteArticle("article-id-123");
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Delete failed");
	});

	it("sets loading state during deletion", async () => {
		let resolveDelete: () => void;
		const deletePromise = new Promise<void>((resolve) => {
			resolveDelete = resolve;
		});
		mockDeleteDoc.mockReturnValue(deletePromise);

		const { result } = renderHook(() => useDeleteArticle());

		expect(result.current.loading).toBe(false);

		let callPromise: Promise<{ success: boolean }>;
		act(() => {
			callPromise = result.current.deleteArticle("article-id-123");
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveDelete?.();
			await callPromise;
		});

		expect(result.current.loading).toBe(false);
	});

	it("can manually set error", () => {
		const { result } = renderHook(() => useDeleteArticle());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
