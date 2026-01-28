import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetProducts } from "../useGetProducts";

// Mock supabase
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		from: vi.fn(() => ({
			select: vi.fn(() => ({
				order: vi.fn(),
			})),
		})),
	},
}));

import { supabase } from "../../lib/supabaseClient";
import type { Product } from "../../types/Product";

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

describe("useGetProducts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useGetProducts());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.fetchProducts).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("fetches products successfully", async () => {
		const mockProducts = [
			{
				id: "1",
				name: "Product 1",
				description: "Desc 1",
				price: 100,
				created_at: "2024-01-01",
				thumbnail_url: "https://example.com/1.jpg",
				marketplace_url: "https://example.com/1",
			},
			{
				id: "2",
				name: "Product 2",
				description: "Desc 2",
				price: 200,
				created_at: "2024-01-02",
				thumbnail_url: "https://example.com/2.jpg",
				marketplace_url: "https://example.com/2",
			},
		];

		const orderMock = vi
			.fn()
			.mockResolvedValue({ data: mockProducts, error: null });
		const selectMock = vi.fn(() => ({ order: orderMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProducts());

		let products: Product[] = [];
		await act(async () => {
			products = await result.current.fetchProducts();
		});

		expect(products).toEqual(mockProducts);
		expect(result.current.error).toBeNull();
		expect(mockFrom).toHaveBeenCalledWith("products");
		expect(selectMock).toHaveBeenCalledWith("*");
		expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
	});

	it("returns empty array when data is null", async () => {
		const orderMock = vi.fn().mockResolvedValue({ data: null, error: null });
		const selectMock = vi.fn(() => ({ order: orderMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProducts());

		let products: Product[] = [];
		await act(async () => {
			products = await result.current.fetchProducts();
		});

		expect(products).toEqual([]);
	});

	it("handles fetch error", async () => {
		const orderMock = vi.fn().mockResolvedValue({
			data: null,
			error: { message: "Fetch failed" },
		});
		const selectMock = vi.fn(() => ({ order: orderMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProducts());

		let products: Product[] = [];
		await act(async () => {
			products = await result.current.fetchProducts();
		});

		expect(products).toEqual([]);
		expect(result.current.error).toBe("Fetch failed");
	});

	it("sets loading state during fetch", async () => {
		let resolveOrder: (value: { data: []; error: null }) => void;
		const orderPromise = new Promise<{ data: []; error: null }>((resolve) => {
			resolveOrder = resolve;
		});
		const orderMock = vi.fn().mockReturnValue(orderPromise);
		const selectMock = vi.fn(() => ({ order: orderMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProducts());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchProducts();
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveOrder!({ data: [], error: null });
			await fetchPromise;
		});

		expect(result.current.loading).toBe(false);
	});

	it("can manually set error", () => {
		const { result } = renderHook(() => useGetProducts());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
