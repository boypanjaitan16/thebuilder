import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFirebaseSession } from "../useFirebaseSession";

vi.mock("firebase/auth", () => ({
	onAuthStateChanged: vi.fn(),
}));

vi.mock("../../lib/firebaseAuth", () => ({
	getFirebaseAuth: vi.fn(),
	onAuthUserRefresh: vi.fn(() => vi.fn()),
}));

import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../../lib/firebaseAuth";

const mockGetFirebaseAuth = vi.mocked(getFirebaseAuth);
const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged);

describe("useFirebaseSession", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with checking state", () => {
		mockGetFirebaseAuth.mockReturnValue({} as never);
		mockOnAuthStateChanged.mockReturnValue(vi.fn());

		const { result } = renderHook(() => useFirebaseSession());

		expect(result.current.checking).toBe(true);
		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.user).toBeNull();
	});

	it("stops checking immediately when Firebase is not configured", () => {
		mockGetFirebaseAuth.mockReturnValue(null);

		const { result } = renderHook(() => useFirebaseSession());

		expect(result.current.checking).toBe(false);
		expect(result.current.isAuthenticated).toBe(false);
	});

	it("sets user when authenticated", async () => {
		const mockUser = { uid: "1", email: "test@example.com", displayName: null };
		mockGetFirebaseAuth.mockReturnValue({} as never);
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
			(callback as (user: unknown) => void)(mockUser);
			return vi.fn();
		});

		const { result } = renderHook(() => useFirebaseSession());

		await waitFor(() => {
			expect(result.current.checking).toBe(false);
		});

		expect(result.current.user).toEqual(mockUser);
		expect(result.current.isAuthenticated).toBe(true);
	});

	it("sets user to null when not authenticated", async () => {
		mockGetFirebaseAuth.mockReturnValue({} as never);
		mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
			(callback as (user: unknown) => void)(null);
			return vi.fn();
		});

		const { result } = renderHook(() => useFirebaseSession());

		await waitFor(() => {
			expect(result.current.checking).toBe(false);
		});

		expect(result.current.user).toBeNull();
		expect(result.current.isAuthenticated).toBe(false);
	});

	it("unsubscribes on unmount", () => {
		const unsubscribeMock = vi.fn();
		mockGetFirebaseAuth.mockReturnValue({} as never);
		mockOnAuthStateChanged.mockReturnValue(unsubscribeMock);

		const { unmount } = renderHook(() => useFirebaseSession());

		unmount();

		expect(unsubscribeMock).toHaveBeenCalled();
	});
});
