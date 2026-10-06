import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useActiveProducts } from "../useActiveProducts";

vi.mock("firebase/firestore", () => ({
	collection: vi.fn(),
	getDocs: vi.fn(),
	orderBy: vi.fn(),
	query: vi.fn(),
	where: vi.fn(),
}));

vi.mock("../../lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(),
}));

vi.mock("../../lib/prerender", () => ({
	isPrerendering: vi.fn(() => false),
}));

import { getDocs, where } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebaseDb";
import { isPrerendering } from "../../lib/prerender";
import type { Product } from "../../types/Product";

const mockGetFirestoreDb = vi.mocked(getFirestoreDb);
const mockGetDocs = vi.mocked(getDocs);
const mockWhere = vi.mocked(where);
const mockIsPrerendering = vi.mocked(isPrerendering);

const FAKE_DB = {} as ReturnType<typeof getFirestoreDb>;

describe("useActiveProducts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
		mockIsPrerendering.mockReturnValue(false);
	});

	it("fetches only active products", async () => {
		const mockProducts: Product[] = [
			{
				id: "1",
				name: "Playbook",
				description: "A playbook",
				price: 100000,
				created_at: "2024-01-02",
				thumbnail_url: "https://example.com/thumb.png",
				marketplace_url: "https://example.com/buy",
				status: "ACTIVE",
			},
		];

		mockGetDocs.mockResolvedValue({
			docs: mockProducts.map((product) => ({ data: () => product })),
		} as never);

		const { result } = renderHook(() => useActiveProducts(), {
			wrapper: createQueryWrapper(),
		});

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.data).toEqual(mockProducts);
		expect(mockWhere).toHaveBeenCalledWith("status", "==", "ACTIVE");
	});

	it("skips the read and stays loading while prerendering", async () => {
		mockIsPrerendering.mockReturnValue(true);

		const { result } = renderHook(() => useActiveProducts(), {
			wrapper: createQueryWrapper(),
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBeNull();
		expect(mockGetDocs).not.toHaveBeenCalled();
	});
});
