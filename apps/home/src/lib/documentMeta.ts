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

export type AlternateLink = { hreflang: string; href: string };

/**
 * Replaces every <link rel="alternate" hreflang> with `entries`; the
 * cleanup removes them and puts the previous set back.
 */
export function setAlternateLinks(entries: AlternateLink[]): () => void {
	const previous = Array.from(
		document.querySelectorAll<HTMLLinkElement>(
			'link[rel="alternate"][hreflang]',
		),
	);
	for (const el of previous) el.remove();

	const added = entries.map(({ hreflang, href }) => {
		const el = document.createElement("link");
		el.setAttribute("rel", "alternate");
		el.setAttribute("hreflang", hreflang);
		el.setAttribute("href", href);
		document.head.appendChild(el);
		return el;
	});

	return () => {
		for (const el of added) el.remove();
		for (const el of previous) document.head.appendChild(el);
	};
}

/** Same pattern as setMetaContent, for <html lang>. */
export function setHtmlLang(lang: string): () => void {
	const root = document.documentElement;
	const previous = root.getAttribute("lang");
	root.setAttribute("lang", lang);
	return () => {
		if (previous === null) root.removeAttribute("lang");
		else root.setAttribute("lang", previous);
	};
}

/** Removes a head element (e.g. canonical on a 404); cleanup puts it back. */
export function removeHeadElement(selector: string): () => void {
	const el = document.head.querySelector(selector);
	el?.remove();
	return () => {
		if (el) document.head.appendChild(el);
	};
}
