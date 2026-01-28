import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateProduct } from "../useCreateProduct";

// Mock supabase
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		from: vi.fn(() => ({
			insert: vi.fn(),
		})),
	},
}));

import { supabase } from "../../lib/supabaseClient";

const mockFrom = supabase.from as ReturnType<typeof vi.fn>;

describe("useCreateProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useCreateProduct());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.createProduct).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("creates product successfully", async () => {
		const insertMock = vi.fn().mockResolvedValue({ error: null });
		mockFrom.mockReturnValue({ insert: insertMock });

		const { result } = renderHook(() => useCreateProduct());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.createProduct(
				{
					name: "Test Product",
					description: "Description",
					price: 100,
					marketplace_url: "https://example.com",
				},
				{ thumbnail_url: "https://example.com/thumb.jpg" },
			);
		});

		expect(response!.success).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockFrom).toHaveBeenCalledWith("products");
		expect(insertMock).toHaveBeenCalledWith({
			name: "Test Product",
			description: "Description",
			price: 100,
			marketplace_url: "https://example.com",
			thumbnail_url: "https://example.com/thumb.jpg",
		});
	});

	it("handles error when creating product fails", async () => {
		const insertMock = vi.fn().mockResolvedValue({
			error: { message: "Insert failed" },
		});
		mockFrom.mockReturnValue({ insert: insertMock });

		const { result } = renderHook(() => useCreateProduct());

		let response: { success: boolean };
		await act(async () => {
			response = await result.current.createProduct(
				{
					name: "Test Product",
					description: "Description",
					price: 100,
					marketplace_url: "https://example.com",
				},
				{ thumbnail_url: null },
			);
		});

		expect(response!.success).toBe(false);
		expect(result.current.error).toBe("Insert failed");
	});

	it("sets loading state during creation", async () => {
		let resolveInsert: (value: { error: null }) => void;
		const insertPromise = new Promise<{ error: null }>((resolve) => {
			resolveInsert = resolve;
		});
		const insertMock = vi.fn().mockReturnValue(insertPromise);
		mockFrom.mockReturnValue({ insert: insertMock });

		const { result } = renderHook(() => useCreateProduct());

		expect(result.current.loading).toBe(false);

		let createPromise: Promise<{ success: boolean }>;
		act(() => {
			createPromise = result.current.createProduct(
				{
					name: "Test Product",
					description: "",
					price: 0,
					marketplace_url: "https://example.com",
				},
				{ thumbnail_url: null },
			);
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveInsert!({ error: null });
			await createPromise;
		});

		expect(result.current.loading).toBe(false);
	});

	it("can manually set error", () => {
		const { result } = renderHook(() => useCreateProduct());

		act(() => {
			result.current.setError("Manual error");
		});

		expect(result.current.error).toBe("Manual error");
	});
});
