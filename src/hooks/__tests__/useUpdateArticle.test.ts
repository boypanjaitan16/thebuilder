import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useUpdateArticle } from "../useUpdateArticle";

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

describe("useUpdateArticle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("updates article successfully", async () => {
		mockUpdateDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useUpdateArticle(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.updateArticle(
					"article-id-123",
					{
						title: "Updated Article",
						slug: "updated-article",
						content: "<p>Updated body</p>",
						status: "PUBLISHED",
					},
					{ cover_image_url: "https://example.com/new-cover.jpg" },
				),
			).resolves.toBeUndefined();
		});

		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(FAKE_DB, "articles", "article-id-123");
		expect(mockUpdateDoc).toHaveBeenCalledWith(
			undefined,
			expect.objectContaining({
				title: "Updated Article",
				slug: "updated-article",
				content: "<p>Updated body</p>",
				status: "PUBLISHED",
				cover_image_url: "https://example.com/new-cover.jpg",
				updated_at: expect.any(String),
			}),
		);
	});

	it("throws when updating article fails", async () => {
		mockUpdateDoc.mockRejectedValue(new Error("Update failed"));

		const { result } = renderHook(() => useUpdateArticle(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.updateArticle(
					"article-id-123",
					{
						title: "Updated Article",
						slug: "updated-article",
						content: "<p>Body</p>",
						status: "DRAFT",
					},
					{ cover_image_url: null },
				),
			).rejects.toThrow("Update failed");
		});

		expect(result.current.error).toBe("Update failed");
	});
});
