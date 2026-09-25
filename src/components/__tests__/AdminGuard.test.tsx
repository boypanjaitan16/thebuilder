import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../hooks/useFirebaseSession", () => ({
	useFirebaseSession: vi.fn(),
}));

import { useFirebaseSession } from "../../hooks/useFirebaseSession";
import { AdminGuard } from "../AdminGuard";

const MockedUseFirebaseSession = vi.mocked(useFirebaseSession);

describe("AdminGuard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("matches snapshot when loading", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: true,
			isAuthenticated: false,
			user: null,
		});

		const { container } = render(
			<MemoryRouter>
				<AdminGuard />
			</MemoryRouter>,
		);

		expect(container).toMatchSnapshot();
	});

	it("shows loading when checking", () => {
		MockedUseFirebaseSession.mockReturnValue({
			checking: true,
			isAuthenticated: false,
			user: null,
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
		MockedUseFirebaseSession.mockReturnValue({
			checking: false,
			isAuthenticated: true,
			user: { uid: "1", email: "test@example.com" } as unknown as ReturnType<
				typeof useFirebaseSession
			>["user"],
		});

		render(
			<MemoryRouter>
				<AdminGuard />
			</MemoryRouter>,
		);

		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});
});
