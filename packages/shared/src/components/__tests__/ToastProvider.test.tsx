import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../ToastProvider";

// Test component to trigger toasts
function ToastTrigger({
	message,
	tone,
	duration,
}: {
	message: string;
	tone?: "success" | "error" | "info";
	duration?: number;
}) {
	const { showToast } = useToast();

	return (
		<button
			onClick={() => showToast(message, { tone, durationMs: duration })}
			type="button"
		>
			Show Toast
		</button>
	);
}

describe("ToastProvider", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("matches snapshot", () => {
		const { container } = render(
			<ToastProvider>
				<div>Child Content</div>
			</ToastProvider>,
		);
		expect(container).toMatchSnapshot();
	});

	it("renders children", () => {
		render(
			<ToastProvider>
				<div>Child Content</div>
			</ToastProvider>,
		);

		expect(screen.getByText("Child Content")).toBeInTheDocument();
	});

	it("shows success toast by default", async () => {
		render(
			<ToastProvider>
				<ToastTrigger message="Success message" />
			</ToastProvider>,
		);

		act(() => {
			screen.getByText("Show Toast").click();
		});

		// Advance timers to trigger the visibility
		await act(async () => {
			await vi.advanceTimersByTimeAsync(50);
		});

		expect(screen.getByText("Success message")).toBeInTheDocument();
	});

	it("shows error toast with correct styling", async () => {
		render(
			<ToastProvider>
				<ToastTrigger message="Error message" tone="error" />
			</ToastProvider>,
		);

		act(() => {
			screen.getByText("Show Toast").click();
		});

		await act(async () => {
			await vi.advanceTimersByTimeAsync(50);
		});

		const toast = screen.getByText("Error message");
		expect(toast).toHaveClass("bg-red-600");
	});

	it("shows info toast with correct styling", async () => {
		render(
			<ToastProvider>
				<ToastTrigger message="Info message" tone="info" />
			</ToastProvider>,
		);

		act(() => {
			screen.getByText("Show Toast").click();
		});

		await act(async () => {
			await vi.advanceTimersByTimeAsync(50);
		});

		const toast = screen.getByText("Info message");
		expect(toast).toHaveClass("bg-ink");
	});

	it("hides toast after duration", async () => {
		render(
			<ToastProvider>
				<ToastTrigger message="Temporary message" duration={1000} />
			</ToastProvider>,
		);

		act(() => {
			screen.getByText("Show Toast").click();
		});

		await act(async () => {
			await vi.advanceTimersByTimeAsync(50);
		});

		expect(screen.getByText("Temporary message")).toBeInTheDocument();

		// Wait for toast to be removed (duration + hide delay)
		await act(async () => {
			await vi.advanceTimersByTimeAsync(1500);
		});

		expect(screen.queryByText("Temporary message")).not.toBeInTheDocument();
	});

	it("can show multiple toasts", async () => {
		function MultiToastTrigger() {
			const { showToast } = useToast();
			return (
				<>
					<button onClick={() => showToast("Toast 1")} type="button">
						Show Toast 1
					</button>
					<button onClick={() => showToast("Toast 2")} type="button">
						Show Toast 2
					</button>
				</>
			);
		}

		render(
			<ToastProvider>
				<MultiToastTrigger />
			</ToastProvider>,
		);

		act(() => {
			screen.getByText("Show Toast 1").click();
			screen.getByText("Show Toast 2").click();
		});

		await act(async () => {
			await vi.advanceTimersByTimeAsync(50);
		});

		expect(screen.getByText("Toast 1")).toBeInTheDocument();
		expect(screen.getByText("Toast 2")).toBeInTheDocument();
	});
});

describe("useToast", () => {
	it("throws error when used outside ToastProvider", () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {
			//
		});

		expect(() => {
			function InvalidComponent() {
				useToast();
				return null;
			}
			render(<InvalidComponent />);
		}).toThrow("useToast must be used within ToastProvider");

		consoleError.mockRestore();
	});
});
