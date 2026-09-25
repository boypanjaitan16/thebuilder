import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { prerender } from "./vite-plugins/prerender";
import { PUBLIC_PATHS } from "./vite-plugins/publicPaths";

const baseFromEnv = process.env.VITE_BASE_PATH || "/";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), prerender(PUBLIC_PATHS)],
	base: baseFromEnv,
});
