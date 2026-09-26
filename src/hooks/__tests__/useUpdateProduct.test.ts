import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useUpdateProduct } from "../useUpdateProduct";

vi.mock("firebase/firestore", () => ({
	doc: vi.fn(),
	updateDoc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { doc, updateDoc } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockUpdateDoc = vi.mocked(updateDoc);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useUpdateProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("updates product successfully", async () => {
		mockUpdateDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useUpdateProduct(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.updateProduct(
					"product-id-123",
					{
						name: "Updated Product",
						description: "Updated Description",
						price: 150,
						marketplace_url: "https://example.com/updated",
					},
					{ thumbnail_url: "https://example.com/new-thumb.jpg" },
				),
			).resolves.toBeUndefined();
		});

		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "products", "product-id-123");
		expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, {
			name: "Updated Product",
			description: "Updated Description",
			price: 150,
			marketplace_url: "https://example.com/updated",
			thumbnail_url: "https://example.com/new-thumb.jpg",
		});
	});

	it("throws when updating product fails", async () => {
		mockUpdateDoc.mockRejectedValue(new Error("Update failed"));

		const { result } = renderHook(() => useUpdateProduct(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.updateProduct(
					"product-id-123",
					{
						name: "Updated Product",
						description: "",
						price: 0,
						marketplace_url: "https://example.com",
					},
					{ thumbnail_url: null },
				),
			).rejects.toThrow("Update failed");
		});

		expect(result.current.error).toBe("Update failed");
	});
});
