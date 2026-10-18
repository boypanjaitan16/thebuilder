type MetaAttr = "name" | "property";

/**
 * Sets (creating if absent) a <meta name/property="key"> tag's content,
 * returning a cleanup that restores the previous content (or removes the
 * tag if it didn't previously exist) — so leaving a page that set
 * page-specific meta doesn't leave it stuck for the rest of the SPA
 * session.
 */
export function setMetaContent(
	attr: MetaAttr,
	key: string,
	content: string,
): () => void {
	let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
	const existed = Boolean(el);
	const previousContent = el?.getAttribute("content") ?? null;

	if (!el) {
		el = document.createElement("meta");
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute("content", content);

	return () => {
		if (!el) return;
		if (existed) {
			if (previousContent !== null) el.setAttribute("content", previousContent);
		} else {
			el.remove();
		}
	};
}

/** Same pattern as setMetaContent, for <link rel="canonical">. */
export function setCanonicalLink(href: string): () => void {
	let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
	const existed = Boolean(el);
	const previousHref = el?.getAttribute("href") ?? null;

	if (!el) {
		el = document.createElement("link");
		el.setAttribute("rel", "canonical");
		document.head.appendChild(el);
	}
	el.setAttribute("href", href);

	return () => {
		if (!el) return;
		if (existed) {
			if (previousHref !== null) el.setAttribute("href", previousHref);
		} else {
			el.remove();
		}
	};
}
