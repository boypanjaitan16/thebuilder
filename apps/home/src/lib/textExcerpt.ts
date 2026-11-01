/**
 * Strips HTML tags from a trusted HTML string (article body is
 * admin-authored via Tiptap, same trust boundary as
 * ArticleDetailPage's dangerouslySetInnerHTML) via the DOM, then
 * truncates to maxLength, preferring a word boundary.
 */
export function stripHtmlAndTruncate(html: string, maxLength: number): string {
	const container = document.createElement("div");
	// textContent glues adjacent blocks ("end.Next"), so pad block ends first.
	container.innerHTML = html.replace(
		/<\/(p|h[1-6]|li|blockquote|div)>|<br\s*\/?>/gi,
		"$& ",
	);
	const text = (container.textContent ?? "").replace(/\s+/g, " ").trim();

	if (text.length <= maxLength) return text;

	const truncated = text.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");
	const boundary = lastSpace > maxLength * 0.6 ? lastSpace : maxLength;
	return `${truncated.slice(0, boundary).trimEnd()}…`;
}
