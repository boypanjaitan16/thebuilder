import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useUploadProductThumbnail } from "../useUploadProductThumbnail";

vi.mock("firebase/storage", () => ({
	getDownloadURL: vi.fn(),
	ref: vi.fn(),
	uploadBytes: vi.fn(),
}));

vi.mock("../../lib/firebaseStorage", () => ({
	getFirebaseStorage: vi.fn(),
}));

vi.mock("../../lib/env", () => ({
	validateFileUpload: vi.fn(),
}));

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { validateFileUpload } from "../../lib/env";
import { getFirebaseStorage } from "../../lib/firebaseStorage";

const mockGetFirebaseStorage = vi.mocked(getFirebaseStorage);
const mockRef = vi.mocked(ref);
const mockUploadBytes = vi.mocked(uploadBytes);
const mockGetDownloadURL = vi.mocked(getDownloadURL);
const MockedValidateFileUpload = vi.mocked(validateFileUpload);

const FAKE_STORAGE = {} as ReturnType<typeof getFirebaseStorage>;

describe("useUploadProductThumbnail", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirebaseStorage.mockReturnValue(FAKE_STORAGE);
	});

	it("throws for invalid file", async () => {
		MockedValidateFileUpload.mockReturnValue({
			valid: false,
			error: "Invalid file type",
		});

		const { result } = renderHook(() => useUploadProductThumbnail(), {
			wrapper: createQueryWrapper(),
		});

		const mockFile = new File([""], "test.txt", { type: "text/plain" });

		await act(async () => {
			await expect(result.current.uploadThumbnail(mockFile)).rejects.toThrow(
				"Invalid file type",
			);
		});

		await waitFor(() =>
			expect(result.current.error).toBe("Invalid file type"),
		);
		expect(mockUploadBytes).not.toHaveBeenCalled();
	});

	it("uploads thumbnail successfully", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });
		mockUploadBytes.mockResolvedValue(undefined as never);
		mockGetDownloadURL.mockResolvedValue(
			"https://firebasestorage.googleapis.com/products/test-uuid.jpg",
		);

		const { result } = renderHook(() => useUploadProductThumbnail(), {
			wrapper: createQueryWrapper(),
		});

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		await act(async () => {
			await expect(result.current.uploadThumbnail(mockFile)).resolves.toBe(
				"https://firebasestorage.googleapis.com/products/test-uuid.jpg",
			);
		});

		expect(result.current.error).toBeNull();
		expect(mockRef).toHaveBeenCalledWith(
			FAKE_STORAGE,
			expect.stringMatching(/^products\/.+\.jpg$/),
		);
	});

	it("throws on upload error", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });
		mockUploadBytes.mockRejectedValue(new Error("Upload failed"));

		const { result } = renderHook(() => useUploadProductThumbnail(), {
			wrapper: createQueryWrapper(),
		});

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		await act(async () => {
			await expect(result.current.uploadThumbnail(mockFile)).rejects.toThrow(
				"Upload failed",
			);
		});

		expect(result.current.error).toBe("Upload failed");
	});
});
