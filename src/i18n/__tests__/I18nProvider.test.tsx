import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider, useI18n } from "../I18nProvider";

// Test component to access i18n context
function TestConsumer() {
	const { language, setLanguage, copy } = useI18n();
	return (
		<div>
			<span data-testid="language">{language}</span>
			<span data-testid="home-text">{copy.nav.home}</span>
			<button onClick={() => setLanguage("en")} type="button">
				Set EN
			</button>
			<button onClick={() => setLanguage("id")} type="button">
				Set ID
			</button>
		</div>
	);
}

describe("I18nProvider", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		window.localStorage.getItem = vi.fn().mockReturnValue(null);
		window.localStorage.setItem = vi.fn();
	});

	it("provides default language as English", () => {
		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		expect(screen.getByTestId("language")).toHaveTextContent("en");
	});

	it("provides English copy by default", () => {
		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		expect(screen.getByTestId("home-text")).toHaveTextContent("Home");
	});

	it("switches to Indonesian language", async () => {
		const user = userEvent.setup();

		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		await user.click(screen.getByText("Set ID"));

		expect(screen.getByTestId("language")).toHaveTextContent("id");
	});

	it("persists language to localStorage", async () => {
		const user = userEvent.setup();

		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		await user.click(screen.getByText("Set ID"));

		expect(window.localStorage.setItem).toHaveBeenCalledWith("tb_lang", "id");
	});

	it("loads language from localStorage on mount", () => {
		window.localStorage.getItem = vi.fn().mockReturnValue("id");

		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		// Need to wait for useEffect to run
		expect(window.localStorage.getItem).toHaveBeenCalledWith("tb_lang");
	});

	it("ignores invalid language in localStorage", () => {
		window.localStorage.getItem = vi.fn().mockReturnValue("fr");

		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		expect(screen.getByTestId("language")).toHaveTextContent("en");
	});

	it("switches back to English", async () => {
		const user = userEvent.setup();

		render(
			<I18nProvider>
				<TestConsumer />
			</I18nProvider>,
		);

		await user.click(screen.getByText("Set ID"));
		expect(screen.getByTestId("language")).toHaveTextContent("id");

		await user.click(screen.getByText("Set EN"));
		expect(screen.getByTestId("language")).toHaveTextContent("en");
	});
});

describe("useI18n", () => {
	it("returns default context values when used outside provider", () => {
		// The default context should work even outside provider
		function DirectConsumer() {
			const { language, copy } = useI18n();
			return (
				<div>
					<span data-testid="lang">{language}</span>
					<span data-testid="copy">{copy.nav.home}</span>
				</div>
			);
		}

		render(<DirectConsumer />);

		expect(screen.getByTestId("lang")).toHaveTextContent("en");
		expect(screen.getByTestId("copy")).toHaveTextContent("Home");
	});
});
