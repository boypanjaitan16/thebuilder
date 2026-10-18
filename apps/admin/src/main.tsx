import { QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@thebuilder/shared/components/ToastProvider";
import { I18nProvider } from "@thebuilder/shared/i18n/I18nProvider";
import { createQueryClient } from "@thebuilder/shared/lib/queryClient";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: "#a0e3d0",
						colorTextLightSolid: "#102a35",
						fontFamily: '"Work Sans", sans-serif',
						borderRadius: 0,
					},
					components: {
						Form: { verticalLabelPadding: "0px", labelColor: "#a5a5a5" },
					},
				}}
			>
				<I18nProvider>
					<ToastProvider>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</ToastProvider>
				</I18nProvider>
			</ConfigProvider>
		</QueryClientProvider>
	</StrictMode>,
);
