import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { AdminHeader } from "../AdminHeader";

vi.mock("../../hooks/useFirebaseSession", () => ({
	useFirebaseSession: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
	signOut: vi.fn(),
}));

vi.mock("../../lib/firebaseAuth", () => ({
	getFirebaseAuth: vi.fn(),
}));

import { signOut } from "firebase/auth";
import { useFirebaseSession } from "../../hooks/useFirebaseSession";
import { getFirebaseAuth } from "../../lib/firebaseAuth";

const MockedUseFirebaseSession = vi.mocked(useFirebaseSession);
const mockGetFirebaseAuth = vi.mocked(getFirebaseAuth);
const mockSignOut = vi.mocked(signOut);

describe("AdminHeader", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetFirebaseAuth.mockReturnValue({} as never);
	});

	it("matches snapshot when not authenticated", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: false,
			user: null,
		});

		const { container } = renderWithMemoryRouter(<AdminHeader />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot when authenticated", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			user: {
				uid: "1",
				email: "admin@example.com",
				displayName: "Test Admin",
			} as unknown as ReturnType<typeof useFirebaseSession>["user"],
		});

		const { container } = renderWithMemoryRouter(<AdminHeader />);
		expect(container).toMatchSnapshot();
	});

	it("renders header with brand name", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: false,
			user: null,
		});

		renderWithMemoryRouter(<AdminHeader />);

		expect(screen.getByText("Admin")).toBeInTheDocument();
		expect(screen.getByText("The Builder")).toBeInTheDocument();
	});

	it("shows Home link when not authenticated", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: false,
			user: null,
		});

		renderWithMemoryRouter(<AdminHeader />);

		// Home button is icon-only (no accessible name) — it's the sole
		// button AdminHeader renders in the unauthenticated state.
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("shows user menu when authenticated", async () => {
		const user = userEvent.setup();
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			user: {
				uid: "1",
				email: "admin@example.com",
				displayName: "Test Admin",
			} as unknown as ReturnType<typeof useFirebaseSession>["user"],
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

	it("shows 'Administrator' when no displayName", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			user: {
				uid: "1",
				email: "admin@example.com",
				displayName: null,
			} as unknown as ReturnType<typeof useFirebaseSession>["user"],
		});

		renderWithMemoryRouter(<AdminHeader />);

		expect(
			screen.getByRole("button", { name: "Administrator" }),
		).toBeInTheDocument();
	});

	it("handles sign out successfully", async () => {
		const user = userEvent.setup();
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			user: {
				uid: "1",
				email: "admin@example.com",
				displayName: "Test Admin",
			} as unknown as ReturnType<typeof useFirebaseSession>["user"],
		});

		mockSignOut.mockResolvedValue(undefined);

		renderWithMemoryRouter(<AdminHeader />);

		const menuButton = screen.getByRole("button", { name: "Test Admin" });
		await user.click(menuButton);

		const signOutButton = await screen.findByRole("menuitem", {
			name: /sign out/i,
		});
		await user.click(signOutButton);

		expect(mockSignOut).toHaveBeenCalled();
	});

	it("closes menu when navigating", async () => {
		const user = userEvent.setup();
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			user: {
				uid: "1",
				email: "admin@example.com",
				displayName: "Test Admin",
			} as unknown as ReturnType<typeof useFirebaseSession>["user"],
		});

		renderWithMemoryRouter(<AdminHeader />);

		await user.click(screen.getByRole("button", { name: "Test Admin" }));
		expect(screen.getByRole("menu")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Test Admin" }));
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});
});
