import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateProduct } from "../useCreateProduct";

vi.mock("firebase/firestore", () => ({
	doc: vi.fn(),
	setDoc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { doc, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockSetDoc = vi.mocked(setDoc);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useCreateProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("initializes with default state", () => {
		const { result } = renderHook(() => useCreateProduct());

		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.createProduct).toBe("function");
		expect(typeof result.current.setError).toBe("function");
	});

	it("creates product successfully", async () => {
		mockSetDoc.mockResolvedValue(undefined);

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
		expect(mockDoc).toHaveBeenCalledWith(
			FAKE_DB,
			"products",
			expect.any(String),
		);
		expect(mockSetDoc).toHaveBeenCalledWith(
			undefined,
			expect.objectContaining({
				id: expect.any(String),
				name: "Test Product",
				description: "Description",
				price: 100,
				marketplace_url: "https://example.com",
				thumbnail_url: "https://example.com/thumb.jpg",
				created_at: expect.any(String),
			}),
		);
	});

	it("handles error when creating product fails", async () => {
		mockSetDoc.mockRejectedValue(new Error("Insert failed"));

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
		let resolveSetDoc: () => void;
		const setDocPromise = new Promise<void>((resolve) => {
			resolveSetDoc = resolve;
		});
		mockSetDoc.mockReturnValue(setDocPromise);

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
			resolveSetDoc?.();
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
