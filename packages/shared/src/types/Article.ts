import type { Language } from "../i18n/translations";

export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type Article = {
	id: string;
	title: string;
	slug: string;
	content: string;
	cover_image_url: string | null;
	status: ArticleStatus;
	language: Language;
	created_at: string;
	updated_at: string;
};
