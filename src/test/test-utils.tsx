import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { ToastProvider } from "../components/ToastProvider";
import { I18nProvider } from "../i18n/I18nProvider";

type WrapperProps = {
	children: ReactNode;
};

function AllProviders({ children }: WrapperProps) {
	return (
		<BrowserRouter>
			<I18nProvider>
				<ToastProvider>{children}</ToastProvider>
			</I18nProvider>
		</BrowserRouter>
	);
}

function createMemoryRouterWrapper(initialEntries: string[] = ["/"]) {
	return function MemoryRouterWrapper({ children }: WrapperProps) {
		return (
			<MemoryRouter initialEntries={initialEntries}>
				<I18nProvider>
					<ToastProvider>{children}</ToastProvider>
				</I18nProvider>
			</MemoryRouter>
		);
	};
}

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options });

const renderWithMemoryRouter = (
	ui: ReactElement,
	initialEntries: string[] = ["/"],
	options?: Omit<RenderOptions, "wrapper">,
) =>
	render(ui, {
		wrapper: createMemoryRouterWrapper(initialEntries),
		...options,
	});

export * from "@testing-library/react";
export { customRender as render, renderWithMemoryRouter };
