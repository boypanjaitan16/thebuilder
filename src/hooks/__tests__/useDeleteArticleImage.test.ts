import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteArticleImage } from "../useDeleteArticleImage";

vi.mock("firebase/storage", () => ({
	deleteObject: vi.fn(),
	ref: vi.fn(),
}));

vi.mock("../../lib/firebaseStorage", () => ({
	getFirebaseStorage: vi.fn(),
}));

import { deleteObject, ref } from "firebase/storage";
import { getFirebaseStorage } from "../../lib/firebaseStorage";

const mockGetFirebaseStorage = vi.mocked(getFirebaseStorage);
const mockRef = vi.mocked(ref);
const mockDeleteObject = vi.mocked(deleteObject);

const FAKE_STORAGE = {} as ReturnType<typeof getFirebaseStorage>;

describe("useDeleteArticleImage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirebaseStorage.mockReturnValue(FAKE_STORAGE);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useDeleteArticleImage());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.deleteImage).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("returns success when url is null", async () => {
		const { result } = renderHook(() => useDeleteArticleImage());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteImage(null);
		});

		expect(response!.success).toBe(true);
		expect(mockDeleteObject).not.toHaveBeenCalled();
	});

	it("deletes image successfully", async () => {
		mockDeleteObject.mockResolvedValue(undefined);

		const { result } = renderHook(() => useDeleteArticleImage());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteImage(
				"https://firebasestorage.googleapis.com/v0/b/app/o/articles%2Fimage.jpg?alt=media",
			);
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockRef).toHaveBeenCalledWith(
			FAKE_STORAGE,
			"https://firebasestorage.googleapis.com/v0/b/app/o/articles%2Fimage.jpg?alt=media",
		);
		expect(mockDeleteObject).toHaveBeenCalled();
	});

	it("handles error when deleting fails", async () => {
		mockDeleteObject.mockRejectedValue(new Error("Delete failed"));

		const { result } = renderHook(() => useDeleteArticleImage());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteImage(
				"https://firebasestorage.googleapis.com/v0/b/app/o/articles%2Fimage.jpg?alt=media",
			);
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Delete failed");
	});

	it("sets loading state during deletion", async () => {
		let resolveDelete: () => void;
		const deletePromise = new Promise<void>((resolve) => {
			resolveDelete = resolve;
		});
		mockDeleteObject.mockReturnValue(deletePromise);

		const { result } = renderHook(() => useDeleteArticleImage());

		expect(result.current.loading).toBe(false);

		let deletePromiseResult: Promise<{ success: boolean }>;
		act(() => {
			deletePromiseResult = result.current.deleteImage(
				"https://example.com/image.jpg",
			);
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveDelete?.();
			await deletePromiseResult;
		});

		expect(result.current.loading).toBe(false);
	});
});
