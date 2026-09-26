import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "../../test/queryTestUtils";
import { useCreateAdvisoryRequest } from "../useCreateAdvisoryRequest";

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

const baseValues = {
	name: "John Doe",
	email: "john@example.com",
	role: "CEO",
	organization: "Acme Inc",
	size: "100-500",
	industry: "Technology",
	expectation: "Growth strategy",
	decisionFlow: "Board approval",
	readiness: "Ready to start",
	timeline: "Q1 2024",
};

describe("useCreateAdvisoryRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirestoreDb.mockReturnValue(FAKE_DB);
	});

	it("creates an advisory request, normalizing omitted optional fields to null", async () => {
		mockSetDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useCreateAdvisoryRequest(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.createAdvisoryRequest(baseValues),
			).resolves.toEqual(
				expect.objectContaining({
					name: "John Doe",
					email: "john@example.com",
					situation: null,
					description: null,
				}),
			);
		});

		expect(result.current.error).toBeNull();
		expect(mockDoc).toHaveBeenCalledWith(
			FAKE_DB,
			"advisoryRequests",
			expect.any(String),
		);
		expect(mockSetDoc).toHaveBeenCalledWith(
			undefined,
			expect.objectContaining({
				id: expect.any(String),
				name: "John Doe",
				email: "john@example.com",
				situation: null,
				description: null,
				created_at: expect.any(String),
			}),
		);
	});

	it("preserves provided situation/description instead of nulling them", async () => {
		mockSetDoc.mockResolvedValue(undefined);

		const { result } = renderHook(() => useCreateAdvisoryRequest(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await result.current.createAdvisoryRequest({
				...baseValues,
				situation: ["Growth"],
				description: "Extra context",
			});
		});

		expect(mockSetDoc).toHaveBeenCalledWith(
			undefined,
			expect.objectContaining({
				situation: ["Growth"],
				description: "Extra context",
			}),
		);
	});

	it("throws when creating fails", async () => {
		mockSetDoc.mockRejectedValue(new Error("Insert failed"));

		const { result } = renderHook(() => useCreateAdvisoryRequest(), {
			wrapper: createQueryWrapper(),
		});

		await act(async () => {
			await expect(
				result.current.createAdvisoryRequest(baseValues),
			).rejects.toThrow("Insert failed");
		});

		expect(result.current.error).toBe("Insert failed");
	});
});
