import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetProduct } from "../useGetProduct";

// Mock dependencies
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		from: vi.fn(() => ({
			select: vi.fn(() => ({
				eq: vi.fn(() => ({
					single: vi.fn(),
				})),
			})),
		})),
	},
}));

vi.mock("../../lib/env", () => ({
	isValidUUID: vi.fn(),
}));

import { isValidUUID } from "../../lib/env";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "../../types/Product";

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;
const MockedIsValidUUID = vi.mocked(isValidUUID);

describe("useGetProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useGetProduct());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.fetchProduct).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("returns null for invalid UUID", async () => {
		MockedIsValidUUID.mockReturnValue(false);

		const { result } = renderHook(() => useGetProduct());

		let product: Product | null = null;
		await act(async () => {
			product = await result.current.fetchProduct("invalid-id");
		});

		expect(product).toBeNull();
		expect(result.current.error).toBe("Invalid product ID format");
		expect(mockFrom).not.toHaveBeenCalled();
	});

	it("fetches product successfully", async () => {
		MockedIsValidUUID.mockReturnValue(true);
		const mockProduct = {
			id: "valid-uuid",
			name: "Test Product",
			description: "Description",
			price: 100,
			created_at: "2024-01-01",
			thumbnail_url: "https://example.com/thumb.jpg",
			marketplace_url: "https://example.com",
		};

		const singleMock = vi
			.fn()
			.mockResolvedValue({ data: mockProduct, error: null });
		const eqMock = vi.fn(() => ({ single: singleMock }));
		const selectMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProduct());

		let product: Product | null = null;
		await act(async () => {
			product = await result.current.fetchProduct("valid-uuid");
		});

		expect(product).toEqual(mockProduct);
		expect(result.current.error).toBeNull();
		expect(mockFrom).toHaveBeenCalledWith("products");
		expect(selectMock).toHaveBeenCalledWith("*");
		expect(eqMock).toHaveBeenCalledWith("id", "valid-uuid");
	});

	it("handles fetch error", async () => {
		MockedIsValidUUID.mockReturnValue(true);
		const singleMock = vi.fn().mockResolvedValue({
			data: null,
			error: { message: "Not found" },
		});
		const eqMock = vi.fn(() => ({ single: singleMock }));
		const selectMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProduct());

		let product: Product | null = null;
		await act(async () => {
			product = await result.current.fetchProduct("valid-uuid");
		});

		expect(product).toBeNull();
		expect(result.current.error).toBe("Not found");
	});

	it("sets loading state during fetch", async () => {
		MockedIsValidUUID.mockReturnValue(true);
		let resolveSingle: (value: { data: null; error: null }) => void;
		const singlePromise = new Promise<{ data: null; error: null }>(
			(resolve) => {
				resolveSingle = resolve;
			},
		);
		const singleMock = vi.fn().mockReturnValue(singlePromise);
		const eqMock = vi.fn(() => ({ single: singleMock }));
		const selectMock = vi.fn(() => ({ eq: eqMock }));
		mockFrom.mockReturnValue({ select: selectMock });

		const { result } = renderHook(() => useGetProduct());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchProduct("valid-uuid");
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveSingle!({ data: null, error: null });
			await fetchPromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
