import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateProduct } from "../useUpdateProduct";

// Mock supabase
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		from: vi.fn(() => ({
			update: vi.fn(() => ({
				eq: vi.fn(),
			})),
		})),
	},
}));

import { supabase } from "../../lib/supabaseClient";

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

describe("useUpdateProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useUpdateProduct());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.updateProduct).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("updates product successfully", async () => {
		const eqMock = vi.fn().mockResolvedValue({ error: null });
		const updateMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ update: updateMock });

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
		expect(mockFrom).toHaveBeenCalledWith("products");
		expect(updateMock).toHaveBeenCalledWith({
			name: "Updated Product",
			description: "Updated Description",
			price: 150,
			marketplace_url: "https://example.com/updated",
			thumbnail_url: "https://example.com/new-thumb.jpg",
		});
		expect(eqMock).toHaveBeenCalledWith("id", "product-id-123");
	});

	it("handles error when updating product fails", async () => {
		const eqMock = vi.fn().mockResolvedValue({
			error: { message: "Update failed" },
		});
		const updateMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ update: updateMock });

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
		let resolveEq: (value: { error: null }) => void;
		const eqPromise = new Promise<{ error: null }>((resolve) => {
			resolveEq = resolve;
		});
		const eqMock = vi.fn().mockReturnValue(eqPromise);
		const updateMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ update: updateMock });

		const { result } = renderHook(() => useUpdateProduct());

		expect(result.current.loading).toBe(false);

		let updatePromise: Promise<{ success: boolean }>;
		act(() => {
			updatePromise = result.current.updateProduct(
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
			resolveEq!({ error: null });
			await updatePromise;
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
