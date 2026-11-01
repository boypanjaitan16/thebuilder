import { QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import { ToastProvider } from "@thebuilder/shared/components/ToastProvider";
import type { ReactElement, ReactNode } from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { LocaleProvider } from "../components/LocaleProvider";
import { createTestQueryClient } from "./queryTestUtils";

type WrapperProps = {
	children: ReactNode;
};

function AllProviders({ children }: WrapperProps) {
	const queryClient = createTestQueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<LocaleProvider>
					<ToastProvider>{children}</ToastProvider>
				</LocaleProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

function createMemoryRouterWrapper(initialEntries: string[] = ["/"]) {
	return function MemoryRouterWrapper({ children }: WrapperProps) {
		const queryClient = createTestQueryClient();
		return (
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={initialEntries}>
					<LocaleProvider>
						<ToastProvider>{children}</ToastProvider>
					</LocaleProvider>
				</MemoryRouter>
			</QueryClientProvider>
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
