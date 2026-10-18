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
		window.localStorage.getItem = vi.fn().mockReturnValue(null);
	});

	it("renders the admin shell and external public links", () => {
		renderWithMemoryRouter(<Layout />);
		expect(screen.getByTestId("admin-header")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Tentang" })).toHaveAttribute(
			"href",
			"https://thebuilder.co.id/about",
		);
	});

	it("scrolls to top on route entry", () => {
		renderWithMemoryRouter(<Layout />, ["/articles"]);
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
