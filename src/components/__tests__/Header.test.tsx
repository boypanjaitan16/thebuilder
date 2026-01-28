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

		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Insights" })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Work With Me" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Resources" })).toBeInTheDocument();
	});

	it("renders language switcher buttons", () => {
		renderWithMemoryRouter(<Header />);

		expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "ID" })).toBeInTheDocument();
	});

	it("switches language when clicking language button", async () => {
		const user = userEvent.setup();
		renderWithMemoryRouter(<Header />);

		const idButton = screen.getByRole("button", { name: "ID" });
		await user.click(idButton);

		expect(window.localStorage.setItem).toHaveBeenCalledWith("tb_lang", "id");
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
		const applyButtons = screen.getAllByRole("link", { name: "Apply" });
		expect(applyButtons.length).toBeGreaterThanOrEqual(1);
	});
});
