import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { AdminHeader } from "../AdminHeader";

// Mock dependencies
vi.mock("../../hooks/useSupabaseSession", () => ({
	useSupabaseSession: vi.fn(),
}));

vi.mock("../../lib/supabaseClient", () => ({
	supabase: {
		auth: {
			signOut: vi.fn(),
		},
	},
}));

import { useSupabaseSession } from "../../hooks/useSupabaseSession";
import { supabase } from "../../lib/supabaseClient";

const MockedUseSupabaseSession = vi.mocked(useSupabaseSession);
const mockSignOut = supabase.auth.signOut as ReturnType<typeof vi.fn>;

describe("AdminHeader", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("matches snapshot when not authenticated", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: false,
			session: null,
		});

		const { container } = renderWithMemoryRouter(<AdminHeader />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot when authenticated", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			session: {
				user: {
					id: "1",
					email: "admin@example.com",
					user_metadata: { full_name: "Test Admin" },
				},
			} as unknown as ReturnType<typeof useSupabaseSession>["session"],
		});

		const { container } = renderWithMemoryRouter(<AdminHeader />);
		expect(container).toMatchSnapshot();
	});

	it("renders header with brand name", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: false,
			session: null,
		});

		renderWithMemoryRouter(<AdminHeader />);

		expect(screen.getByText("Admin")).toBeInTheDocument();
		expect(screen.getByText("The Builder")).toBeInTheDocument();
	});

	it("shows Home link when not authenticated", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: false,
			session: null,
		});

		renderWithMemoryRouter(<AdminHeader />);

		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
	});

	it("shows user menu when authenticated", async () => {
		const user = userEvent.setup();
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			session: {
				user: {
					id: "1",
					email: "admin@example.com",
					user_metadata: { full_name: "Test Admin" },
				},
			} as unknown as ReturnType<typeof useSupabaseSession>["session"],
		});

		renderWithMemoryRouter(<AdminHeader />);

		const menuButton = screen.getByRole("button", { name: "Test Admin" });
		expect(menuButton).toBeInTheDocument();

		await user.click(menuButton);

		expect(screen.getByRole("menu")).toBeInTheDocument();
		expect(
			screen.getByRole("menuitem", { name: "Update Profile" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("menuitem", { name: "Update Password" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("menuitem", { name: "Products" }),
		).toBeInTheDocument();
	});

	it("shows 'Administrator' when no full_name in metadata", () => {
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			session: {
				user: {
					id: "1",
					email: "admin@example.com",
					user_metadata: {},
				},
			} as unknown as ReturnType<typeof useSupabaseSession>["session"],
		});

		renderWithMemoryRouter(<AdminHeader />);

		expect(
			screen.getByRole("button", { name: "Administrator" }),
		).toBeInTheDocument();
	});

	it("handles sign out successfully", async () => {
		const user = userEvent.setup();
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			session: {
				user: {
					id: "1",
					email: "admin@example.com",
					user_metadata: { full_name: "Test Admin" },
				},
			} as unknown as ReturnType<typeof useSupabaseSession>["session"],
		});

		mockSignOut.mockResolvedValue({ error: null });

		renderWithMemoryRouter(<AdminHeader />);

		const menuButton = screen.getByRole("button", { name: "Test Admin" });
		await user.click(menuButton);

		// Wait for menu to appear and find Sign Out button
		const signOutButton = await screen.findByRole("button", {
			name: /sign out/i,
		});
		await user.click(signOutButton);

		expect(mockSignOut).toHaveBeenCalled();
	});

	it("closes menu when navigating", async () => {
		const user = userEvent.setup();
		MockedUseSupabaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			session: {
				user: {
					id: "1",
					email: "admin@example.com",
					user_metadata: { full_name: "Test Admin" },
				},
			} as unknown as ReturnType<typeof useSupabaseSession>["session"],
		});

		renderWithMemoryRouter(<AdminHeader />);

		await user.click(screen.getByRole("button", { name: "Test Admin" }));
		expect(screen.getByRole("menu")).toBeInTheDocument();

		// Toggle the menu again
		await user.click(screen.getByRole("button", { name: "Test Admin" }));
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});
});
