import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "@thebuilder/shared/components/ToastProvider";
import { I18nProvider } from "@thebuilder/shared/i18n/I18nProvider";
import { createQueryClient } from "@thebuilder/shared/lib/queryClient";
import App from "./App.tsx";

const queryClient = createQueryClient();

const ReactQueryDevtools = lazy(() =>
	import("@tanstack/react-query-devtools").then((module) => ({
		default: module.ReactQueryDevtools,
	})),
);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<I18nProvider>
				<ToastProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ToastProvider>
			</I18nProvider>
			{import.meta.env.DEV && (
				<Suspense fallback={null}>
					<ReactQueryDevtools initialIsOpen={false} />
				</Suspense>
			)}
		</QueryClientProvider>
	</StrictMode>,
);
