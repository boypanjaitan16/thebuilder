import { screen, waitFor } from "@testing-library/react";
import type { Article } from "@thebuilder/shared/types/Article";
import { Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	PRERENDER_DATA_SCRIPT_ID,
	serializePrerenderData,
} from "../../../lib/prerenderData";
import { renderWithMemoryRouter } from "../../../test/test-utils";
import ArticleDetailPage from "../ArticleDetailPage";

// No Firebase in tests: the background refetch fails, which must not hide
// an article that was already seeded into the page.
vi.mock("@thebuilder/shared/lib/firebaseDb", () => ({
	getFirestoreDb: vi.fn(() => null),
}));

const article: Article = {
	id: "1",
	title: "Kepemimpinan yang Bertahan",
	slug: "kepemimpinan",
	content: "<p>Isi artikel.</p>",
	cover_image_url: null,
	status: "PUBLISHED",
	language: "id",
	created_at: "2026-09-01T00:00:00.000Z",
	updated_at: "2026-09-02T00:00:00.000Z",
};

function seed(data: Article) {
	const script = document.createElement("script");
	script.type = "application/json";
	script.id = PRERENDER_DATA_SCRIPT_ID;
	script.textContent = serializePrerenderData({ article: data });
	document.head.appendChild(script);
}

function renderAt(path: string) {
	return renderWithMemoryRouter(
		<Routes>
			<Route path="/insights/:slug" element={<ArticleDetailPage />} />
		</Routes>,
		[path],
	);
}

afterEach(() => {
	document.getElementById(PRERENDER_DATA_SCRIPT_ID)?.remove();
});

describe("ArticleDetailPage", () => {
	it("renders a seeded article with its meta, JSON-LD and canonical share URL", async () => {
		seed(article);
		renderAt("/insights/kepemimpinan");

		expect(
			screen.getByRole("heading", { level: 1, name: article.title }),
		).toBeInTheDocument();
		expect(screen.getByText("Isi artikel.")).toBeInTheDocument();
		expect(document.title).toBe(`The Builder — ${article.title}`);

		const jsonLd = document.getElementById("article-jsonld");
		expect(JSON.parse(jsonLd?.textContent ?? "{}")).toMatchObject({
			"@type": "BlogPosting",
			headline: article.title,
			inLanguage: "id",
			url: "https://thebuilder.co.id/insights/kepemimpinan",
		});

		const shareLink = screen.getByRole("link", { name: /linkedin/i });
		expect(shareLink.getAttribute("href")).toContain(
			encodeURIComponent("https://thebuilder.co.id/insights/kepemimpinan"),
		);
	});

	it("keeps the seeded article when the background refetch fails", async () => {
		seed(article);
		renderAt("/insights/kepemimpinan");

		// Let the refetch settle (it rejects: Firebase is not configured).
		await waitFor(() =>
			expect(screen.getByText("Isi artikel.")).toBeInTheDocument(),
		);
		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(screen.getByText("Isi artikel.")).toBeInTheDocument();
	});

	it("shows not found when nothing is seeded and the fetch fails", async () => {
		renderAt("/insights/kepemimpinan");

		expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
			"Halaman yang Anda cari tidak ditemukan.",
		);
	});
});
