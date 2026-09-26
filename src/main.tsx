import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ToastProvider } from "./components/ToastProvider.tsx";
import { I18nProvider } from "./i18n/I18nProvider.tsx";
import { queryClient } from "./lib/queryClient.ts";

const ReactQueryDevtools = lazy(() =>
	import("@tanstack/react-query-devtools").then((module) => ({
		default: module.ReactQueryDevtools,
	})),
);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: "#0ea5e9",
						// borderRadius: 10,
						fontFamily: '"Work Sans", sans-serif',
					},
					components: {
						Form: {
							verticalLabelPadding: "0px",
							labelColor: "#a5a5a5",
						},
					},
				}}
			>
				<I18nProvider>
					<ToastProvider>
						<BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
							<App />
						</BrowserRouter>
					</ToastProvider>
				</I18nProvider>
			</ConfigProvider>
			{import.meta.env.DEV && (
				<Suspense fallback={null}>
					<ReactQueryDevtools initialIsOpen={false} />
				</Suspense>
			)}
		</QueryClientProvider>
	</StrictMode>,
);
