import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useDeleteAdvisoryRequest } from "../useDeleteAdvisoryRequest";

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

describe("useDeleteAdvisoryRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("deletes an advisory request successfully", async () => {
		mockDeleteDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useDeleteAdvisoryRequest(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.deleteAdvisoryRequest("request-id-123"),
			).resolves.toBeUndefined();
		});

		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(
			FAKE_DB,
			"advisoryRequests",
			"request-id-123",
		);
		expect(mockDeleteDoc).toHaveBeenCalled();
	});

	it("throws when deleting fails", async () => {
		mockDeleteDoc.mockRejectedValue(new Error("Delete failed"));

		const { result } = renderHook(() => useDeleteAdvisoryRequest(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.deleteAdvisoryRequest("request-id-123"),
			).rejects.toThrow("Delete failed");
		});

		expect(result.current.error).toBe("Delete failed");
	});
});
