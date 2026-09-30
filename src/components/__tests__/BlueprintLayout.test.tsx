import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OrganizationPage from "../../pages/OrganizationPage";
import { renderWithMemoryRouter } from "../../test/test-utils";
import BlueprintLayout from "../BlueprintLayout";

describe("BlueprintLayout", () => {
	it("renders organization transformation as an interior page with a breadcrumb", () => {
		renderWithMemoryRouter(
			<Routes>
				<Route element={<BlueprintLayout />}>
					<Route
						path="/organization-transformation"
						element={<OrganizationPage />}
					/>
				</Route>
			</Routes>,
			["/organization-transformation"],
		);

		const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
		expect(breadcrumb).toHaveTextContent("Beranda");
		expect(breadcrumb).toHaveTextContent("Transformasi Organisasi");
		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Ajukan Percakapan Advisory/i }),
		).toHaveAttribute("href", "/apply");
	});
	it("keeps resource navigation and language switching available on a nested public page", async () => {
		const user = userEvent.setup();
		renderWithMemoryRouter(
			<Routes>
				<Route element={<BlueprintLayout />}>
					<Route
						path="/resources/guides-playbooks"
						element={<p>Guide content</p>}
					/>
				</Route>
			</Routes>,
			["/resources/guides-playbooks"],
		);

		const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
		expect(breadcrumb).toHaveTextContent("Beranda");
		expect(breadcrumb).toHaveTextContent("Sumber Daya");
		expect(breadcrumb).toHaveTextContent("Panduan & Playbook");
		expect(screen.getByText("Guide content")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "EN" }));
		expect(breadcrumb).toHaveTextContent("Guides & Playbooks");
		expect(
			within(breadcrumb).getByRole("link", { name: "Resources" }),
		).toBeInTheDocument();
	});
});
