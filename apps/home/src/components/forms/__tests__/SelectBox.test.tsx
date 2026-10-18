import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectBox } from "../SelectBox";

const mockOptions = [
	{ label: "Option 1", value: "1" },
	{ label: "Option 2", value: "2" },
	{ label: "Option 3", value: "3" },
];

describe("SelectBox", () => {
	it("matches snapshot with default props", () => {
		const { container } = render(
			<SelectBox label="Category" options={mockOptions} />,
		);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot with error", () => {
		const { container } = render(
			<SelectBox
				label="Category"
				options={mockOptions}
				errorMessage="Required"
				placeholder="Select..."
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("renders with label", () => {
		render(<SelectBox label="Category" options={mockOptions} />);

		expect(screen.getByText("Category")).toBeInTheDocument();
	});

	it("renders select element with options", () => {
		render(<SelectBox label="Category" options={mockOptions} />);

		const select = screen.getByRole("combobox");
		expect(select).toBeInTheDocument();

		expect(
			screen.getByRole("option", { name: "Option 1" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("option", { name: "Option 2" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("option", { name: "Option 3" }),
		).toBeInTheDocument();
	});

	it("renders placeholder when provided", () => {
		render(
			<SelectBox
				label="Category"
				options={mockOptions}
				placeholder="Select a category"
			/>,
		);

		const placeholder = screen.getByRole("option", {
			name: "Select a category",
		});
		expect(placeholder).toBeInTheDocument();
		expect(placeholder).toBeDisabled();
	});

	it("shows error message when provided", () => {
		render(
			<SelectBox
				label="Category"
				options={mockOptions}
				errorMessage="Please select a category"
			/>,
		);

		expect(screen.getByText("Please select a category")).toBeInTheDocument();
	});

	it("applies error styling when error is present", () => {
		render(
			<SelectBox label="Category" options={mockOptions} errorMessage="Error" />,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("border-red-400");
		expect(select).toHaveAttribute("aria-invalid", "true");
	});

	it("applies normal styling when no error", () => {
		render(<SelectBox label="Category" options={mockOptions} />);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("border-sand");
		expect(select).toHaveAttribute("aria-invalid", "false");
	});

	it("applies custom select className", () => {
		render(
			<SelectBox
				label="Category"
				options={mockOptions}
				selectClassName="custom-class"
			/>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveClass("custom-class");
	});

	it("passes selectProps to select element", () => {
		render(
			<SelectBox
				label="Category"
				options={mockOptions}
				selectProps={{
					name: "category",
					required: true,
				}}
			/>,
		);

		const select = screen.getByRole("combobox");
		expect(select).toHaveAttribute("name", "category");
		expect(select).toHaveAttribute("required");
	});

	it("renders options with correct values", () => {
		render(<SelectBox label="Category" options={mockOptions} />);

		const options = screen.getAllByRole("option");
		expect(options[0]).toHaveValue("1");
		expect(options[1]).toHaveValue("2");
		expect(options[2]).toHaveValue("3");
	});

	it("applies error label styling", () => {
		render(
			<SelectBox label="Category" options={mockOptions} errorMessage="Error" />,
		);

		const label = screen.getByText("Category").closest("label");
		expect(label).toHaveClass("text-red-600");
	});
});
