/**
 * True while the build-time prerender (puppeteer, vite-plugins/prerender.ts)
 * is crawling the page — headless Chrome sets `navigator.webdriver`.
 */
export function isPrerendering(): boolean {
	return typeof navigator !== "undefined" && navigator.webdriver === true;
}
