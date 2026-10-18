import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { Article } from "../types/Article";
import type { Product } from "../types/Product";
export async function fetchPublishedArticles(): Promise<Article[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	try {
		const snapshot = await getDocs(
			query(
				collection(db, "articles"),
				where("status", "==", "PUBLISHED"),
				orderBy("created_at", "desc"),
			),
		);
		return snapshot.docs.map((doc) => doc.data() as Article);
	} catch (err) {
		if (import.meta.env.DEV) {
			// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error (e.g. "missing index") in dev, since the UI only ever shows a generic message
			console.error("useGetPublishedArticles:", err);
		}
		throw err;
	}
}

export async function fetchPublishedArticleBySlug(
	slug: string,
): Promise<Article> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	let snapshot: Awaited<ReturnType<typeof getDocs>>;
	try {
		snapshot = await getDocs(
			query(
				collection(db, "articles"),
				where("slug", "==", slug),
				where("status", "==", "PUBLISHED"),
				limit(1),
			),
		);
	} catch (err) {
		if (import.meta.env.DEV) {
			// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error in dev, since the UI only ever shows a generic message
			console.error("useGetArticleBySlug:", err);
		}
		throw err;
	}

	const doc = snapshot.docs[0];
	if (!doc) {
		throw new Error("Article not found.");
	}
	return doc.data() as Article;
}

export async function fetchActiveProducts(): Promise<Product[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	try {
		const snapshot = await getDocs(
			query(
				collection(db, "products"),
				where("status", "==", "ACTIVE"),
				orderBy("created_at", "desc"),
			),
		);
		return snapshot.docs.map((doc) => doc.data() as Product);
	} catch (err) {
		if (import.meta.env.DEV) {
			// biome-ignore lint/suspicious/noConsole: surfaces the real Firestore error (e.g. "missing index") in dev, since the UI only ever shows a generic message
			console.error("useActiveProducts:", err);
		}
		throw err;
	}
}
