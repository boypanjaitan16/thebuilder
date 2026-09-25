import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetProduct } from "../useGetProduct";

vi.mock("firebase/firestore", () => ({
	doc: vi.fn(),
	getDoc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

vi.mock("../../lib/env", () => ({
	isValidUUID: vi.fn(),
}));

import { doc, getDoc } from "firebase/firestore";
import { isValidUUID } from "../../lib/env";
import { getFirestoreDb } from "../../lib/firebaseDb";
import type { Product } from "../../types/Product";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockGetDoc = vi.mocked(getDoc);
const MockedIsValidUUID = vi.mocked(isValidUUID);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useGetProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
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
		expect(mockGetDoc).not.toHaveBeenCalled();
	});

	it("fetches product successfully", async () => {
		MockedIsValidUUID.mockReturnValue(true);
		const mockProduct: Product = {
			id: "valid-uuid",
			name: "Test Product",
			description: "Description",
			price: 100,
			created_at: "2024-01-01",
			thumbnail_url: "https://example.com/thumb.jpg",
			marketplace_url: "https://example.com",
		};

		mockGetDoc.mockResolvedValue({
			exists: () => true,
			data: () => mockProduct,
		} as never);

		const { result } = renderHook(() => useGetProduct());

		let product: Product | null = null;
		await act(async () => {
			product = await result.current.fetchProduct("valid-uuid");
		});

		expect(product).toEqual(mockProduct);
		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "products", "valid-uuid");
	});

	it("returns null and sets error when product does not exist", async () => {
		MockedIsValidUUID.mockReturnValue(true);
		mockGetDoc.mockResolvedValue({ exists: () => false } as never);

		const { result } = renderHook(() => useGetProduct());

		let product: Product | null = null;
		await act(async () => {
			product = await result.current.fetchProduct("valid-uuid");
		});

		expect(product).toBeNull();
		expect(result.current.error).toBe("Product not found.");
	});

	it("handles fetch error", async () => {
		MockedIsValidUUID.mockReturnValue(true);
		mockGetDoc.mockRejectedValue(new Error("Not found"));

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
		let resolveGetDoc: (value: { exists: () => boolean }) => void;
		const getDocPromise = new Promise<{ exists: () => boolean }>((resolve) => {
			resolveGetDoc = resolve;
		});
		mockGetDoc.mockReturnValue(getDocPromise as never);

		const { result } = renderHook(() => useGetProduct());

		expect(result.current.loading).toBe(false);

		let fetchPromise: Promise<unknown>;
		act(() => {
			fetchPromise = result.current.fetchProduct("valid-uuid");
		});

		expect(result.current.loading).toBe(true);

		await act(async () => {
			resolveGetDoc?.({ exists: () => false });
			await fetchPromise;
		});

		expect(result.current.loading).toBe(false);
	});
});
