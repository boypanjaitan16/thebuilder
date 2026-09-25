import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ToastProvider } from "./components/ToastProvider.tsx";
import { I18nProvider } from "./i18n/I18nProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
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
	</StrictMode>,
);
