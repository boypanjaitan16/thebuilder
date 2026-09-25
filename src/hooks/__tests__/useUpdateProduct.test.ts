import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateProduct } from "../useUpdateProduct";

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

describe("useUpdateProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useUpdateProduct());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.updateProduct).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("updates product successfully", async () => {
		mockUpdateDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useUpdateProduct());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.updateProduct(
				"product-id-123",
				{
					name: "Updated Product",
					description: "Updated Description",
					price: 150,
					marketplace_url: "https://example.com/updated",
				},
				{ thumbnail_url: "https://example.com/new-thumb.jpg" },
			);
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "products", "product-id-123");
		expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, {
			name: "Updated Product",
			description: "Updated Description",
			price: 150,
			marketplace_url: "https://example.com/updated",
			thumbnail_url: "https://example.com/new-thumb.jpg",
		});
	});

	it("handles error when updating product fails", async () => {
		mockUpdateDoc.mockRejectedValue(new Error("Update failed"));

		const { result } = renderHook(() => useUpdateProduct());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.updateProduct(
				"product-id-123",
				{
					name: "Updated Product",
					description: "",
					price: 0,
					marketplace_url: "https://example.com",
				},
				{ thumbnail_url: null },
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

		const { result } = renderHook(() => useUpdateProduct());

		expect(result.current.loading).toBe(false);

		let callPromise: Promise<{ success: boolean }>;
		act(() => {
			callPromise = result.current.updateProduct(
				"product-id-123",
				{
					name: "Test",
					description: "",
					price: 0,
					marketplace_url: "https://example.com",
				},
				{ thumbnail_url: null },
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
		const { result } = renderHook(() => useUpdateProduct());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
