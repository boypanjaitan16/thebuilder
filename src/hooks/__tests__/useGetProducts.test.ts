import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetProducts } from "../useGetProducts";

vi.mock("firebase/firestore", () => ({
	collection: vi.fn(),
	getDocs: vi.fn(),
	orderBy: vi.fn(),
	query: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";
import type { Product } from "../../types/Product";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockGetDocs = vi.mocked(getDocs);
const mockCollection = vi.mocked(collection);
const mockOrderBy = vi.mocked(orderBy);
const mockQuery = vi.mocked(query);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetProducts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useGetProducts());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.fetchProducts).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("fetches products successfully", async () => {
		const mockProducts: Product[] = [
			{
				id: "1",
				name: "Product 1",
				description: "Desc 1",
				price: 100,
				created_at: "2024-01-02",
				thumbnail_url: "https://example.com/1.jpg",
				marketplace_url: "https://example.com/1",
			},
			{
				id: "2",
				name: "Product 2",
				description: "Desc 2",
				price: 200,
				created_at: "2024-01-01",
				thumbnail_url: "https://example.com/2.jpg",
				marketplace_url: "https://example.com/2",
			},
		];

		mockGetDocs.mockResolvedValue({
			docs: mockProducts.map((product) => ({ data: () => product })),
		} as never);

		const { result } = renderHook(() => useGetProducts());

		let products: Product[] = [];
		await act(async () => {
			products = await result.current.fetchProducts();
		});

		expect(products).toEqual(mockProducts);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "products");
		expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");
		expect(mockQuery).toHaveBeenCalled();
	});

	it("returns empty array when Firebase is not configured", async () => {
		mockGetFirestoreDb.mockReturnValue(null);

		const { result } = renderHook(() => useGetProducts());

		let products: Product[] = [];
		await act(async () => {
			products = await result.current.fetchProducts();
		});

		expect(products).toEqual([]);
		expect(result.current.error).toBe("Firebase is not configured.");
	});

	it("handles fetch error", async () => {
		mockGetDocs.mockRejectedValue(new Error("Fetch failed"));

		const { result } = renderHook(() => useGetProducts());

		let products: Product[] = [];
		await act(async () => {
			products = await result.current.fetchProducts();
		});

		expect(products).toEqual([]);
		expect(result.current.error).toBe("Fetch failed");
	});

	it("sets loading state during fetch", async () => {
		let resolveDocs: (value: { docs: [] }) => void;
		const docsPromise = new Promise<{ docs: [] }>((resolve) => {
			resolveDocs = resolve;
		});
		mockGetDocs.mockReturnValue(docsPromise as never);

		const { result } = renderHook(() => useGetProducts());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchProducts();
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveDocs?.({ docs: [] });
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
