import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { Header } from "../Header";

describe("Header", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.localStorage.getItem = vi.fn().mockReturnValue(null);
	});

	it("matches snapshot", () => {
		const { container } = renderWithMemoryRouter(<Header />);
		expect(container).toMatchSnapshot();
	});

	it("renders the brand name", () => {
		renderWithMemoryRouter(<Header />);

		expect(screen.getByText("The Builder")).toBeInTheDocument();
		expect(
			screen.getByText("Building Organization That Scale"),
		).toBeInTheDocument();
	});

	it("renders navigation links", () => {
		renderWithMemoryRouter(<Header />);

		expect(screen.getByRole("link", { name: "Beranda" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Insights" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Bekerja Bersama" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Sumber Daya" }),
		).toBeInTheDocument();
	});

	it("toggles mobile menu", async () => {
		const user = userEvent.setup();
		renderWithMemoryRouter(<Header />);

		const menuButton = screen.getByLabelText("Open navigation");
		await user.click(menuButton);

		expect(screen.getByLabelText("Close navigation")).toBeInTheDocument();
	});

	it("renders Apply button", () => {
		renderWithMemoryRouter(<Header />);

		// There are two Apply buttons (desktop and mobile)
		const applyButtons = screen.getAllByRole("link", { name: "Ajukan" });
		expect(applyButtons.length).toBeGreaterThanOrEqual(1);
	});
});
