import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSupabaseSession } from "../useSupabaseSession";

// Mock supabase
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		auth: {
			getSession: vi.fn(),
			onAuthStateChange: vi.fn(),
		},
	},
}));

import { supabase } from "../../lib/supabaseClient";

const mockGetSession = supabase.auth.getSession as ReturnType<typeof vi.fn>;
const mockOnAuthStateChange = supabase.auth.onAuthStateChange as ReturnType<
	typeof vi.fn
>;

describe("useSupabaseSession", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("initializes with checking state", () => {
		mockGetSession.mockReturnValue(
			new Promise(() => {
				/* pending */
			}),
		);
		mockOnAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		const { result } = renderHook(() => useSupabaseSession());

		expect(result.current.checking).toBe(true);
		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.session).toBeNull();
	});

	it("sets session when authenticated", async () => {
		const mockSession = {
			user: { id: "1", email: "test@example.com", user_metadata: {} },
		};

		mockGetSession.mockResolvedValue({
			data: { session: mockSession },
			error: null,
		});
		mockOnAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		const { result } = renderHook(() => useSupabaseSession());

		await waitFor(() => {
			expect(result.current.checking).toBe(false);
		});

		expect(result.current.session).toEqual(mockSession);
		expect(result.current.isAuthenticated).toBe(true);
	});

	it("sets session to null when not authenticated", async () => {
		mockGetSession.mockResolvedValue({
			data: { session: null },
			error: null,
		});
		mockOnAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: vi.fn() } },
		});

		const { result } = renderHook(() => useSupabaseSession());

		await waitFor(() => {
			expect(result.current.checking).toBe(false);
		});

		expect(result.current.session).toBeNull();
		expect(result.current.isAuthenticated).toBe(false);
	});

	it("subscribes to auth state changes", async () => {
		mockGetSession.mockResolvedValue({
			data: { session: null },
			error: null,
		});

		let authCallback: (event: string, session: unknown) => void;
		mockOnAuthStateChange.mockImplementation(
			(callback: (event: string, session: unknown) => void) => {
				authCallback = callback;
				return {
					data: { subscription: { unsubscribe: vi.fn() } },
				};
			},
		);

		const { result } = renderHook(() => useSupabaseSession());

		await waitFor(() => {
			expect(result.current.checking).toBe(false);
		});

		expect(result.current.isAuthenticated).toBe(false);

		// Simulate auth state change
		const newSession = {
			user: { id: "1", email: "test@example.com", user_metadata: {} },
		};

		act(() => {
			authCallback("SIGNED_IN", newSession);
		});

		expect(result.current.session).toEqual(newSession);
		expect(result.current.isAuthenticated).toBe(true);
	});

	it("unsubscribes on unmount", async () => {
		const unsubscribeMock = vi.fn();

		mockGetSession.mockResolvedValue({
			data: { session: null },
			error: null,
		});
		mockOnAuthStateChange.mockReturnValue({
			data: { subscription: { unsubscribe: unsubscribeMock } },
		});

		const { unmount } = renderHook(() => useSupabaseSession());

		await waitFor(() => {
			expect(mockOnAuthStateChange).toHaveBeenCalled();
		});

		unmount();

		expect(unsubscribeMock).toHaveBeenCalled();
	});
});
