import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUploadProductThumbnail } from "../useUploadProductThumbnail";

// Mock dependencies
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		storage: {
			from: vi.fn(() => ({
				upload: vi.fn(),
				getPublicUrl: vi.fn(),
			})),
		},
	},
}));

vi.mock("../../lib/env", () => ({
	env: {
		thumbnailBucket: "product-thumbnails",
	},
	validateFileUpload: vi.fn(),
}));

import { validateFileUpload } from "../../lib/env";
import { supabase } from "../../lib/supabaseClient";

const mockStorageFrom = supabase.storage.from as ReturnType<typeof vi.fn>;
const MockedValidateFileUpload = vi.mocked(validateFileUpload);

describe("useUploadProductThumbnail", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useUploadProductThumbnail());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.uploadThumbnail).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("returns error for invalid file", async () => {
		MockedValidateFileUpload.mockReturnValue({
			valid: false,
			error: "Invalid file type",
		});

		const { result } = renderHook(() => useUploadProductThumbnail());

		const mockFile = new File([""], "test.txt", { type: "text/plain" });

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadThumbnail(mockFile);
		});

		expect(response!.success).toBe(false);
		expect(response!.url).toBeNull();
		expect(result.current.error).toBe("Invalid file type");
	});

	it("uploads thumbnail successfully", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });

		const uploadMock = vi.fn().mockResolvedValue({
			data: { path: "products/test-uuid.jpg" },
			error: null,
		});
		const getPublicUrlMock = vi.fn().mockReturnValue({
			data: { publicUrl: "https://supabase.co/storage/products/test-uuid.jpg" },
		});

		mockStorageFrom.mockReturnValue({
			upload: uploadMock,
			getPublicUrl: getPublicUrlMock,
		});

		const { result } = renderHook(() => useUploadProductThumbnail());

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadThumbnail(mockFile);
		});

		expect(response!.success).toBe(true);
		expect(response!.url).toBe(
			"https://supabase.co/storage/products/test-uuid.jpg",
		);
		expect(result.current.error).toBeNull();
	});

	it("handles upload error", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });

		const uploadMock = vi.fn().mockResolvedValue({
			data: null,
			error: { message: "Upload failed" },
		});

		mockStorageFrom.mockReturnValue({
			upload: uploadMock,
			getPublicUrl: vi.fn(),
		});

		const { result } = renderHook(() => useUploadProductThumbnail());

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadThumbnail(mockFile);
		});

		expect(response!.success).toBe(false);
		expect(response!.url).toBeNull();
		expect(result.current.error).toBe("Upload failed");
	});

	it("handles missing upload path", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });

		const uploadMock = vi.fn().mockResolvedValue({
			data: { path: null },
			error: null,
		});

		mockStorageFrom.mockReturnValue({
			upload: uploadMock,
			getPublicUrl: vi.fn(),
		});

		const { result } = renderHook(() => useUploadProductThumbnail());

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let response: { success: boolean; url: string | null };
		await act(async () => {
			response = await result.current.uploadThumbnail(mockFile);
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Failed to upload thumbnail.");
	});

	it("sets loading state during upload", async () => {
		MockedValidateFileUpload.mockReturnValue({ valid: true });

		let resolveUpload: (value: { data: { path: string }; error: null }) => void;
		const uploadPromise = new Promise<{ data: { path: string }; error: null }>(
			(resolve) => {
				resolveUpload = resolve;
			},
		);
		const uploadMock = vi.fn().mockReturnValue(uploadPromise);
		const getPublicUrlMock = vi.fn().mockReturnValue({
			data: { publicUrl: "https://example.com/image.jpg" },
		});

		mockStorageFrom.mockReturnValue({
			upload: uploadMock,
			getPublicUrl: getPublicUrlMock,
		});

		const { result } = renderHook(() => useUploadProductThumbnail());

		expect(result.current.loading).toBe(false);

		const mockFile = new File(["image data"], "test.jpg", {
			type: "image/jpeg",
		});

		let uploadFilePromise: Promise<{ success: boolean; url: string | null }>;
		act(() => {
			uploadFilePromise = result.current.uploadThumbnail(mockFile);
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveUpload!({ data: { path: "test.jpg" }, error: null });
			await uploadFilePromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
