import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter, screen } from "../../test/test-utils";
import { ShareButtons } from "../ShareButtons";

function stubNavigatorShare(value: typeof navigator.share | undefined) {
	Object.defineProperty(navigator, "share", {
		value,
		configurable: true,
		writable: true,
	});
}

function stubNavigatorClipboard(value: Partial<Clipboard> | undefined) {
	Object.defineProperty(navigator, "clipboard", {
		value,
		configurable: true,
		writable: true,
	});
}

describe("ShareButtons", () => {
	afterEach(() => {
		stubNavigatorShare(undefined);
		stubNavigatorClipboard(undefined);
	});

	it("shows the native Share button when navigator.share is available", () => {
		stubNavigatorShare(vi.fn().mockResolvedValue(undefined));

		renderWithMemoryRouter(
			<ShareButtons title="Test Article" url="https://example.com/a" />,
		);

		expect(
			screen.getByRole("button", { name: /^share$/i }),
		).toBeInTheDocument();
	});

	it("hides the native Share button when navigator.share is unavailable", () => {
		stubNavigatorShare(undefined);

		renderWithMemoryRouter(
			<ShareButtons title="Test Article" url="https://example.com/a" />,
		);

		expect(
			screen.queryByRole("button", { name: /^share$/i }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /copy link/i }),
		).toBeInTheDocument();
	});

	it("calls navigator.share with the article title and url", async () => {
		const user = userEvent.setup();
		const shareMock = vi.fn().mockResolvedValue(undefined);
		stubNavigatorShare(shareMock);

		renderWithMemoryRouter(
			<ShareButtons title="Test Article" url="https://example.com/a" />,
		);

		await user.click(screen.getByRole("button", { name: /^share$/i }));

		expect(shareMock).toHaveBeenCalledWith({
			title: "Test Article",
			url: "https://example.com/a",
		});
	});

	describe("copy link", () => {
		beforeEach(() => {
			stubNavigatorShare(undefined);
		});

		it("copies the url and shows 'Copied' feedback", async () => {
			const user = userEvent.setup();
			const writeTextMock = vi.fn().mockResolvedValue(undefined);
			stubNavigatorClipboard({ writeText: writeTextMock });

			renderWithMemoryRouter(
				<ShareButtons title="Test Article" url="https://example.com/a" />,
			);

			await user.click(screen.getByRole("button", { name: /copy link/i }));

			expect(writeTextMock).toHaveBeenCalledWith("https://example.com/a");
			expect(
				await screen.findByRole("button", { name: /^copied$/i }),
			).toBeInTheDocument();
		});
	});
});
