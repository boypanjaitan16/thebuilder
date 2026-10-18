import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingIndicator from "../LoadingIndicator";

describe("LoadingIndicator", () => {
	it("matches snapshot with default props", () => {
		const { container } = render(<LoadingIndicator />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot with custom props", () => {
		const { container } = render(
			<LoadingIndicator label="Please wait..." size={48} className="custom" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("renders with default props", () => {
		render(<LoadingIndicator />);

		const status = screen.getByRole("status");
		expect(status).toBeInTheDocument();
		expect(status).toHaveAttribute("aria-label", "Loading");
		expect(screen.getByText("Loading")).toBeInTheDocument();
	});

	it("renders with custom label", () => {
		render(<LoadingIndicator label="Please wait..." />);

		expect(screen.getByRole("status")).toHaveAttribute(
			"aria-label",
			"Please wait...",
		);
		expect(screen.getByText("Please wait...")).toBeInTheDocument();
	});

	it("renders with custom size", () => {
		render(<LoadingIndicator size={48} />);

		const spinner = screen.getByRole("status").querySelector("span");
		expect(spinner).toHaveStyle({ width: "48px", height: "48px" });
	});

	it("renders with custom className", () => {
		render(<LoadingIndicator className="custom-class" />);

		expect(screen.getByRole("status")).toHaveClass("custom-class");
	});

	it("renders spinner element", () => {
		render(<LoadingIndicator />);

		const spinner = screen
			.getByRole("status")
			.querySelector("span.animate-spin");
		expect(spinner).toBeInTheDocument();
	});

	it("applies default size of 32px", () => {
		render(<LoadingIndicator />);

		const spinner = screen.getByRole("status").querySelector("span");
		expect(spinner).toHaveStyle({ width: "32px", height: "32px" });
	});
});
