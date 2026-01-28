import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteProductThumbnail } from "../useDeleteProductThumbnail";

// Mock dependencies
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		storage: {
			from: vi.fn(() => ({
				remove: vi.fn(),
			})),
		},
	},
}));

vi.mock("../../lib/supabaseStorage", () => ({
	getStoragePathFromPublicUrl: vi.fn(),
}));

import { supabase } from "../../lib/supabaseClient";
import { getStoragePathFromPublicUrl } from "../../lib/supabaseStorage";

const mockStorageFrom = supabase.storage.from as ReturnType<typeof vi.fn>;
const MockedGetStoragePath = vi.mocked(getStoragePathFromPublicUrl);

describe("useDeleteProductThumbnail", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useDeleteProductThumbnail());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.deleteThumbnail).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("returns success when url is null", async () => {
		const { result } = renderHook(() => useDeleteProductThumbnail());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteThumbnail(null);
		});

		expect(response!.success).toBe(true);
		expect(mockStorageFrom).not.toHaveBeenCalled();
	});

	it("returns error when path cannot be extracted", async () => {
		MockedGetStoragePath.mockReturnValue(null);

		const { result } = renderHook(() => useDeleteProductThumbnail());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteThumbnail(
				"https://invalid-url.com",
			);
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Invalid thumbnail URL.");
	});

	it("deletes thumbnail successfully", async () => {
		MockedGetStoragePath.mockReturnValue("products/image.jpg");
		const removeMock = vi.fn().mockResolvedValue({ error: null });
		mockStorageFrom.mockReturnValue({
			remove: removeMock,
		});

		const { result } = renderHook(() => useDeleteProductThumbnail());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteThumbnail(
				"https://supabase.co/storage/v1/object/public/product-thumbnails/products/image.jpg",
			);
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(removeMock).toHaveBeenCalledWith(["products/image.jpg"]);
	});

	it("handles error when deleting fails", async () => {
		MockedGetStoragePath.mockReturnValue("products/image.jpg");
		const removeMock = vi.fn().mockResolvedValue({
			error: { message: "Delete failed" },
		});
		mockStorageFrom.mockReturnValue({
			remove: removeMock,
		});

		const { result } = renderHook(() => useDeleteProductThumbnail());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteThumbnail(
				"https://supabase.co/storage/v1/object/public/product-thumbnails/products/image.jpg",
			);
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Delete failed");
	});

	it("sets loading state during deletion", async () => {
		MockedGetStoragePath.mockReturnValue("products/image.jpg");
		let resolveRemove: (value: { error: null }) => void;
		const removePromise = new Promise<{ error: null }>((resolve) => {
			resolveRemove = resolve;
		});
		const removeMock = vi.fn().mockReturnValue(removePromise);
		mockStorageFrom.mockReturnValue({
			remove: removeMock,
		});

		const { result } = renderHook(() => useDeleteProductThumbnail());

		expect(result.current.loading).toBe(false);

		let deletePromise: Promise<{ success: boolean }>;
		act(() => {
			deletePromise = result.current.deleteThumbnail(
				"https://example.com/image.jpg",
			);
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveRemove!({ error: null });
			await deletePromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
