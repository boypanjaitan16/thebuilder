import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
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

	it("resolves without deleting when url is null", async () => {
		const { result } = renderHook(() => useDeleteArticleImage(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(result.current.deleteImage(null)).resolves.toBeUndefined();
		});

		expect(mockDeleteObject).not.toHaveBeenCalled();
	});

	it("deletes image successfully", async () => {
		mockDeleteObject.mockResolvedValue(undefined);

		const { result } = renderHook(() => useDeleteArticleImage(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.deleteImage(
					"https://firebasestorage.googleapis.com/v0/b/app/o/articles%2Fimage.jpg?alt=media",
				),
			).resolves.toBeUndefined();
		});

		expect(result.current.error).toBeNull();
		expect(mockRef).toHaveBeenCalledWith(
			FAKE_STORAGE,
			"https://firebasestorage.googleapis.com/v0/b/app/o/articles%2Fimage.jpg?alt=media",
		);
		expect(mockDeleteObject).toHaveBeenCalled();
	});

	it("throws when deleting fails", async () => {
		mockDeleteObject.mockRejectedValue(new Error("Delete failed"));

		const { result } = renderHook(() => useDeleteArticleImage(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.deleteImage(
					"https://firebasestorage.googleapis.com/v0/b/app/o/articles%2Fimage.jpg?alt=media",
				),
			).rejects.toThrow("Delete failed");
		});

		expect(result.current.error).toBe("Delete failed");
	});
});
