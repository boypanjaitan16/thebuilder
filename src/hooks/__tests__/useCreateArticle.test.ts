import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useCreateArticle } from "../useCreateArticle";

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

describe("useCreateArticle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("creates article successfully", async () => {
		mockSetDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useCreateArticle(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.createArticle(
					{
						title: "Test Article",
						slug: "test-article",
						content: "<p>Body</p>",
						status: "DRAFT",
					},
					{ cover_image_url: "https://example.com/cover.jpg" },
				),
			).resolves.toEqual(
				expect.objectContaining({
					title: "Test Article",
					slug: "test-article",
				}),
			);
		});

		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(
			FAKE_DB,
			"articles",
			expect.any(String),
		);
		expect(mockSetDoc).toHaveBeenCalledWith(
			undefined,
			expect.objectContaining({
				id: expect.any(String),
				title: "Test Article",
				slug: "test-article",
				content: "<p>Body</p>",
				status: "DRAFT",
				cover_image_url: "https://example.com/cover.jpg",
				created_at: expect.any(String),
				updated_at: expect.any(String),
			}),
		);
	});

	it("throws when creating article fails", async () => {
		mockSetDoc.mockRejectedValue(new Error("Insert failed"));

		const { result } = renderHook(() => useCreateArticle(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.createArticle(
					{
						title: "Test Article",
						slug: "test-article",
						content: "<p>Body</p>",
						status: "DRAFT",
					},
					{ cover_image_url: null },
				),
			).rejects.toThrow("Insert failed");
		});

		expect(result.current.error).toBe("Insert failed");
	});
});
