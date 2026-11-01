import { describe, expect, it } from "vitest";
import { stripHtmlAndTruncate } from "../textExcerpt";

describe("stripHtmlAndTruncate", () => {
	it("keeps a space between block elements", () => {
		expect(
			stripHtmlAndTruncate(
				"<p>First.</p><p>Second<br>line</p><ul><li>a</li><li>b</li></ul>",
				100,
			),
		).toBe("First. Second line a b");
	});

	it("truncates at a word boundary", () => {
		expect(stripHtmlAndTruncate("<p>one two three four</p>", 10)).toBe(
			"one two…",
		);
	});
});
