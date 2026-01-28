import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteProduct } from "../useDeleteProduct";

// Mock supabase
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		from: vi.fn(() => ({
			delete: vi.fn(() => ({
				eq: vi.fn(),
			})),
		})),
	},
}));

import { supabase } from "../../lib/supabaseClient";

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

describe("useDeleteProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useDeleteProduct());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.deleteProduct).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("deletes product successfully", async () => {
		const eqMock = vi.fn().mockResolvedValue({ error: null });
		const deleteMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ delete: deleteMock });

		const { result } = renderHook(() => useDeleteProduct());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteProduct("product-id-123");
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockFrom).toHaveBeenCalledWith("products");
		expect(deleteMock).toHaveBeenCalled();
		expect(eqMock).toHaveBeenCalledWith("id", "product-id-123");
	});

	it("handles error when deleting product fails", async () => {
		const eqMock = vi.fn().mockResolvedValue({
			error: { message: "Delete failed" },
		});
		const deleteMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ delete: deleteMock });

		const { result } = renderHook(() => useDeleteProduct());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.deleteProduct("product-id-123");
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Delete failed");
	});

	it("sets loading state during deletion", async () => {
		let resolveEq: (value: { error: null }) => void;
		const eqPromise = new Promise<{ error: null }>((resolve) => {
			resolveEq = resolve;
		});
		const eqMock = vi.fn().mockReturnValue(eqPromise);
		const deleteMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ delete: deleteMock });

		const { result } = renderHook(() => useDeleteProduct());

		expect(result.current.loading).toBe(false);

		let deletePromise: Promise<{ success: boolean }>;
		act(() => {
			deletePromise = result.current.deleteProduct("product-id-123");
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveEq!({ error: null });
			await deletePromise;
		});

		expect(result.current.loading).toBe(false);
	});

	it("can manually set error", () => {
		const { result } = renderHook(() => useDeleteProduct());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
