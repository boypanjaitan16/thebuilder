/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const testGlob = "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		// Each app runs with its own setup; admin mocks browser APIs antd needs.
		projects: [
			{
				extends: true,
				test: {
					name: "home",
					setupFiles: ["./apps/home/src/test/setup.ts"],
					include: [`apps/home/src/${testGlob}`],
				},
			},
			{
				extends: true,
				test: {
					name: "admin",
					setupFiles: ["./apps/admin/src/test/setup.ts"],
					include: [`apps/admin/src/${testGlob}`],
				},
			},
			{
				extends: true,
				test: {
					name: "shared",
					setupFiles: ["./apps/home/src/test/setup.ts"],
					include: [`packages/shared/src/${testGlob}`],
				},
			},
		],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"**/src/test/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/main.tsx",
			],
		},
	},
});
