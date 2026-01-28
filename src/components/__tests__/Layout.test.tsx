import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { Layout } from "../Layout";

// Mock child components
vi.mock("../Header", () => ({
	Header: () => <div data-testid="header">Header</div>,
}));

vi.mock("../AdminHeader", () => ({
	AdminHeader: () => <div data-testid="admin-header">AdminHeader</div>,
}));

describe("Layout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.scrollTo = vi.fn();
		window.localStorage.getItem = vi.fn().mockReturnValue(null);
	});

	it("matches snapshot for regular layout", () => {
		const { container } = renderWithMemoryRouter(<Layout />, ["/"]);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot for admin layout", () => {
		const { container } = renderWithMemoryRouter(<Layout />, ["/admin"]);
		expect(container).toMatchSnapshot();
	});

	it("renders regular Header for non-admin routes", () => {
		renderWithMemoryRouter(<Layout />, ["/"]);

		expect(screen.getByTestId("header")).toBeInTheDocument();
		expect(screen.queryByTestId("admin-header")).not.toBeInTheDocument();
	});

	it("renders AdminHeader for admin routes", () => {
		renderWithMemoryRouter(<Layout />, ["/admin"]);

		expect(screen.getByTestId("admin-header")).toBeInTheDocument();
		expect(screen.queryByTestId("header")).not.toBeInTheDocument();
	});

	it("renders AdminHeader for nested admin routes", () => {
		renderWithMemoryRouter(<Layout />, ["/admin/products"]);

		expect(screen.getByTestId("admin-header")).toBeInTheDocument();
	});

	it("renders footer with brand name", () => {
		renderWithMemoryRouter(<Layout />, ["/"]);

		expect(screen.getByText("The Builder")).toBeInTheDocument();
	});

	it("renders footer navigation links", () => {
		renderWithMemoryRouter(<Layout />, ["/"]);

		expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Insights" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Work With Me" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Privacy Policy" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Resources" })).toBeInTheDocument();
	});

	it("scrolls to top on route change", () => {
		renderWithMemoryRouter(<Layout />, ["/"]);

		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
