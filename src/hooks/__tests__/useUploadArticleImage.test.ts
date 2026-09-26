import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUploadArticleImage } from "../useUploadArticleImage";

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

describe("useUploadArticleImage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirebaseStorage.mockReturnValue(FAKE_STORAGE);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useUploadArticleImage());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.uploadImage).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("returns error for invalid file", async () => {
		MockedValidateFileUpload.mockReturnValue({
			valid: false,
			error: "Invalid file type",
		});

		const { result } = renderHook(() => useUploadArticleImage());

		const mockFile = new File([""], "test.txt", { type: "text/plain" });

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadImage(mockFile);
		});

		expect(response!.success).toBe(false);
		expect(response!.url).toBeNull();
		expect(result.current.error).toBe("Invalid file type");
		expect(mockUploadBytes).not.toHaveBeenCalled();
	});

	it("uploads image successfully", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });
		mockUploadBytes.mockResolvedValue(undefined as never);
		mockGetDownloadURL.mockResolvedValue(
			"https://firebasestorage.googleapis.com/articles/test-uuid.jpg",
		);

		const { result } = renderHook(() => useUploadArticleImage());

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadImage(mockFile);
		});

		expect(response!.success).toBe(true);
		expect(response!.url).toBe(
			"https://firebasestorage.googleapis.com/articles/test-uuid.jpg",
		);
		expect(result.current.error).toBeNull();
		expect(mockRef).toHaveBeenCalledWith(
			FAKE_STORAGE,
			expect.stringMatching(/^articles\/.+\.jpg$/),
		);
	});

	it("handles upload error", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });
		mockUploadBytes.mockRejectedValue(new Error("Upload failed"));

		const { result } = renderHook(() => useUploadArticleImage());

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadImage(mockFile);
		});

		expect(response!.success).toBe(false);
		expect(response!.url).toBeNull();
		expect(result.current.error).toBe("Upload failed");
	});

	it("sets loading state during upload", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });

		let resolveUpload: () => void;
		const uploadPromise = new Promise<void>((resolve) => {
			resolveUpload = resolve;
		});
		mockUploadBytes.mockReturnValue(uploadPromise as never);
		mockGetDownloadURL.mockResolvedValue("https://example.com/image.jpg");

		const { result } = renderHook(() => useUploadArticleImage());

		expect(result.current.loading).toBe(false);

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let uploadFilePromise: Promise<{ success: boolean; url: string | null }>;
		act(() => {
			uploadFilePromise = result.current.uploadImage(mockFile);
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveUpload?.();
			await uploadFilePromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
