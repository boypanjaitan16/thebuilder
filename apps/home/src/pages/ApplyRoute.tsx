import { ConfigProvider } from "antd";
import ApplyPage from "./ApplyPage";

export default function ApplyRoute() {
	return (
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
			<ApplyPage />
		</ConfigProvider>
	);
}
