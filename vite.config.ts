import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { fetchPublishedArticlesForBuild } from "./vite-plugins/fetchPublishedArticles";
import { generateSitemap } from "./vite-plugins/generateSitemap";
import { prerender } from "./vite-plugins/prerender";
import { PUBLIC_PATHS } from "./vite-plugins/publicPaths";

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
	const baseFromEnv = process.env.VITE_BASE_PATH || "/";

	// loadEnv reads .env/.env.local for local builds; process.env (CI's real
	// injected secrets) is spread last so it wins over any stray local .env
	// value for the same key — matters in CI, harmless locally.
	const fileEnv = loadEnv(mode, process.cwd(), "");
	const resolvedEnv = { ...fileEnv, ...process.env };

	const articles = await fetchPublishedArticlesForBuild({
		apiKey: resolvedEnv.VITE_FIREBASE_API_KEY,
		authDomain: resolvedEnv.VITE_FIREBASE_AUTH_DOMAIN,
		projectId: resolvedEnv.VITE_FIREBASE_PROJECT_ID,
		storageBucket: resolvedEnv.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: resolvedEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: resolvedEnv.VITE_FIREBASE_APP_ID,
		measurementId: resolvedEnv.VITE_FIREBASE_MEASUREMENT_ID,
	});
	const articlePaths = articles.map((article) => `/insights/${article.slug}`);

	return {
		plugins: [
			react(),
			prerender([...PUBLIC_PATHS, ...articlePaths]),
			generateSitemap(articles),
		],
		base: baseFromEnv,
	};
});
