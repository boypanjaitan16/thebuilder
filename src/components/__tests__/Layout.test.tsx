import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { Layout } from "../Layout";

vi.mock("../AdminHeader", () => ({
	AdminHeader: () => <div data-testid="admin-header">AdminHeader</div>,
}));

vi.mock("../BlueprintLayout", () => ({
	default: () => <div data-testid="blueprint-layout">BlueprintLayout</div>,
}));

describe("Layout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.scrollTo = vi.fn();
		window.localStorage.getItem = vi.fn().mockReturnValue(null);
	});

	it.each([
		"/",
		"/organization-transformation",
		"/future-talent-strategy",
		"/risk-and-business-continuity",
		"/insights",
		"/insights/article-slug",
		"/work-with-me",
		"/apply",
		"/diagnostic",
		"/risk-readiness-diagnostic",
		"/resources",
		"/resources/foundational-thinking",
		"/resources/products",
		"/about",
		"/architecture",
		"/privacy",
		"/unknown",
	])("renders Blueprint layout for %s", async (path) => {
		renderWithMemoryRouter(<Layout />, [path]);
		expect(await screen.findByTestId("blueprint-layout")).toBeInTheDocument();
		expect(screen.queryByTestId("admin-header")).not.toBeInTheDocument();
	});

	it.each([
		"/admin",
		"/admin/login",
		"/admin/products",
	])("keeps the admin layout for %s", async (path) => {
		renderWithMemoryRouter(<Layout />, [path]);
		expect(await screen.findByTestId("admin-header")).toBeInTheDocument();
		expect(screen.queryByTestId("blueprint-layout")).not.toBeInTheDocument();
	});

	it("matches the admin layout snapshot", async () => {
		const { container } = renderWithMemoryRouter(<Layout />, ["/admin"]);
		await screen.findByTestId("admin-header");
		expect(container).toMatchSnapshot();
	});

	it("scrolls to top on route change", () => {
		renderWithMemoryRouter(<Layout />, ["/insights"]);
		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
