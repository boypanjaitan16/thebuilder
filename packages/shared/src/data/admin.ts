import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";
import { getFirestoreDb } from "../lib/firebaseDb";
import type { AdvisoryRequest } from "../types/AdvisoryRequest";
import type { Article } from "../types/Article";
import type { Product } from "../types/Product";
export async function fetchAllArticles(): Promise<Article[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snapshot = await getDocs(
		query(collection(db, "articles"), orderBy("created_at", "desc")),
	);
	return snapshot.docs.map((doc) => doc.data() as Article);
}

export async function fetchArticleById(id: string): Promise<Article> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snap = await getDoc(doc(db, "articles", id));
	if (!snap.exists()) {
		throw new Error("Article not found.");
	}
	return snap.data() as Article;
}

export async function fetchAllProducts(): Promise<Product[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snapshot = await getDocs(
		query(collection(db, "products"), orderBy("created_at", "desc")),
	);
	return snapshot.docs.map((doc) => doc.data() as Product);
}

export async function fetchAllAdvisoryRequests(): Promise<AdvisoryRequest[]> {
	const db = getFirestoreDb();
	if (!db) {
		throw new Error("Firebase is not configured.");
	}

	const snapshot = await getDocs(
		query(collection(db, "advisoryRequests"), orderBy("created_at", "desc")),
	);
	return snapshot.docs.map((doc) => doc.data() as AdvisoryRequest);
}
