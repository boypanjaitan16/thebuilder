import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { Layout } from "../Layout";

vi.mock("../AdminHeader", () => ({
	AdminHeader: () => <div data-testid="admin-header">AdminHeader</div>,
}));

describe("Admin layout", () => {
	beforeEach(() => {
		window.scrollTo = vi.fn();
	});

	it("renders the header and no footer", () => {
		renderWithMemoryRouter(<Layout />, ["/articles"]);
		expect(screen.getByTestId("admin-header")).toBeInTheDocument();
		expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
	});

	it("hides the header on the login screen", () => {
		renderWithMemoryRouter(<Layout />, ["/login"]);
		expect(screen.queryByTestId("admin-header")).not.toBeInTheDocument();
	});

	it("scrolls to top on route entry", () => {
		renderWithMemoryRouter(<Layout />, ["/articles"]);
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
