import { render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ArticleEditor } from "../ArticleEditor";

vi.mock("../../hooks/useUploadArticleImage", () => ({
	useUploadArticleImage: () => ({
		uploadImage: vi.fn(),
		isPending: false,
		error: null,
	}),
}));

describe("ArticleEditor", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("mounts without crashing under StrictMode (double-effect invocation)", async () => {
		const onChange = vi.fn();
		render(
			<StrictMode>
				<ArticleEditor content="<p>Hello world</p>" onChange={onChange} />
			</StrictMode>,
		);

		await waitFor(() => {
			expect(screen.getByText("Hello world")).toBeInTheDocument();
		});
	});

	it("renders the editor and toolbar for empty initial content", async () => {
		render(<ArticleEditor content="" onChange={vi.fn()} />);

		await waitFor(() => {
			expect(document.querySelector(".ProseMirror")).toBeInTheDocument();
		});
	});
});
