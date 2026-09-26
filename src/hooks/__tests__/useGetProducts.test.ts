import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
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
const mockCollection = vi.mocked(collection);
const mockGetDocs = vi.mocked(getDocs);
const mockQuery = vi.mocked(query);
const mockOrderBy = vi.mocked(orderBy);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetProducts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("fetches products successfully", async () => {
		const mockProducts: Product[] = [
			{
				id: "1",
				name: "Product",
				description: "Desc",
				price: 1000,
				created_at: "2024-01-01",
				thumbnail_url: "https://example.com/thumb.jpg",
				marketplace_url: "https://example.com",
			},
		];
		mockGetDocs.mockResolvedValue({
			docs: mockProducts.map((product) => ({ data: () => product })),
		} as never);

		const { result } = renderHook(() => useGetProducts(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockProducts);
		expect(result.current.error).toBeNull();
		expect(mockCollection).toHaveBeenCalledWith(FAKE_DB, "products");
		expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");
		expect(mockQuery).toHaveBeenCalled();
	});

	it("surfaces an error when fetch fails", async () => {
		mockGetDocs.mockRejectedValue(new Error("Failed"));

		const { result } = renderHook(() => useGetProducts(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBe("Failed");
	});
});
