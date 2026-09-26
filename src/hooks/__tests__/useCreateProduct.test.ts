import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
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

	it("creates product successfully", async () => {
		mockSetDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useCreateProduct(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.createProduct(
					{
						name: "Test Product",
						description: "Description",
						price: 100,
						marketplace_url: "https://example.com",
					},
					{ thumbnail_url: "https://example.com/thumb.jpg" },
				),
			).resolves.toEqual(expect.objectContaining({ name: "Test Product" }));
		});

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

	it("throws when creating product fails", async () => {
		mockSetDoc.mockRejectedValue(new Error("Insert failed"));

		const { result } = renderHook(() => useCreateProduct(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.createProduct(
					{
						name: "Test Product",
						description: "Description",
						price: 100,
						marketplace_url: "https://example.com",
					},
					{ thumbnail_url: null },
				),
			).rejects.toThrow("Insert failed");
		});

		expect(result.current.error).toBe("Insert failed");
	});
});
