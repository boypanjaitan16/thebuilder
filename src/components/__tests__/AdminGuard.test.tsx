import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock supabaseClient FIRST
vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		auth: {
			getSession: vi.fn(),
			onAuthStateChange: vi.fn(() => ({
				data: { subscription: { unsubscribe: vi.fn() } },
			})),
		},
	},
}));

// Mock useSupabaseSession
vi.mock("../../hooks/useSupabaseSession", () => ({
	useSupabaseSession: vi.fn(),
}));

import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { AdminGuard } from "../AdminGuard";

const MockedUseSupabaseSession = vi.mocked(useSupabaseSession);

describe("AdminGuard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("matches snapshot when loading", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: true,
			isAuthenticated: false,
			session: null,
		});

		const { container } = render(
			<MemoryRouter>
				<AdminGuard />
			</MemoryRouter>,
		);

		expect(container).toMatchSnapshot();
	});

	it("shows loading when checking", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: true,
			isAuthenticated: false,
			session: null,
		});

		render(
			<MemoryRouter>
				<AdminGuard />
			</MemoryRouter>,
		);

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByText("Checking session…")).toBeInTheDocument();
	});

	it("does not show loading when authenticated", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			session: {
				user: { id: "1", email: "test@example.com", user_metadata: {} },
			} as unknown as ReturnType<typeof useSupabaseSession>["session"],
		});

		render(
			<MemoryRouter>
				<AdminGuard />
			</MemoryRouter>,
		);

		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});
});
