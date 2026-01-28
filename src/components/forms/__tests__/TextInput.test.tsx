import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextInput } from "../TextInput";

describe("TextInput", () => {
	it("matches snapshot with default props", () => {
		const { container } = render(<TextInput label="Email" />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot with error", () => {
		const { container } = render(
			<TextInput label="Email" errorMessage="Invalid email" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("renders with label", () => {
		render(<TextInput label="Email" />);

		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("renders input element", () => {
		render(<TextInput label="Email" inputProps={{ type: "email" }} />);

		const input = screen.getByRole("textbox");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("type", "email");
	});

	it("shows error message when provided", () => {
		render(<TextInput label="Email" errorMessage="Invalid email" />);

		expect(screen.getByText("Invalid email")).toBeInTheDocument();
	});

	it("applies error styling when error is present", () => {
		render(<TextInput label="Email" errorMessage="Invalid email" />);

		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("border-red-400");
		expect(input).toHaveAttribute("aria-invalid", "true");
	});

	it("applies normal styling when no error", () => {
		render(<TextInput label="Email" />);

		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("border-sand");
		expect(input).toHaveAttribute("aria-invalid", "false");
	});

	it("applies custom input className", () => {
		render(<TextInput label="Email" inputClassName="custom-class" />);

		const input = screen.getByRole("textbox");
		expect(input).toHaveClass("custom-class");
	});

	it("passes inputProps to input element", () => {
		render(
			<TextInput
				label="Email"
				inputProps={{
					placeholder: "Enter email",
					name: "email",
					required: true,
				}}
			/>,
		);

		const input = screen.getByRole("textbox");
		expect(input).toHaveAttribute("placeholder", "Enter email");
		expect(input).toHaveAttribute("name", "email");
		expect(input).toHaveAttribute("required");
	});

	it("applies error label styling", () => {
		render(<TextInput label="Email" errorMessage="Error" />);

		const label = screen.getByText("Email").closest("label");
		expect(label).toHaveClass("text-red-600");
	});

	it("applies normal label styling when no error", () => {
		render(<TextInput label="Email" />);

		const label = screen.getByText("Email").closest("label");
		expect(label).toHaveClass("text-ink");
	});
});
