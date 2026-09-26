import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useDeleteProduct } from "../useDeleteProduct";

vi.mock("firebase/firestore", () => ({
	deleteDoc: vi.fn(),
	doc: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

import { deleteDoc, doc } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockDoc = vi.mocked(doc);
const mockDeleteDoc = vi.mocked(deleteDoc);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useDeleteProduct", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("deletes product successfully", async () => {
		mockDeleteDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useDeleteProduct(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.deleteProduct("product-id-123"),
			).resolves.toBeUndefined();
		});

		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "products", "product-id-123");
		expect(mockDeleteDoc).toHaveBeenCalled();
	});

	it("throws when deleting product fails", async () => {
		mockDeleteDoc.mockRejectedValue(new Error("Delete failed"));

		const { result } = renderHook(() => useDeleteProduct(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.deleteProduct("product-id-123"),
			).rejects.toThrow("Delete failed");
		});

		expect(result.current.error).toBe("Delete failed");
	});
});
