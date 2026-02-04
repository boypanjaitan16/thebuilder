import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "../lib/env";
import type { GhostPost } from "../types/GhostPost";

type GhostPostsResponse = {
	posts: GhostPost[];
};

const ghostFields = [
	"id",
	"title",
	"url",
	"feature_image",
	"feature_image_alt",
].join(",");

const normalizeGhostAdminDomain = (domain: string): string => {
	const trimmed = domain.trim();
	if (!trimmed) return "";
	const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
		? trimmed
		: `https://${trimmed}`;
	return withProtocol.replace(/\/+$/, "");
};

const buildGhostPostsUrl = (adminDomain: string, apiKey: string): string => {
	const normalizedDomain = normalizeGhostAdminDomain(adminDomain);
	const url = new URL("/ghost/api/content/posts/", normalizedDomain);
	url.searchParams.set("key", apiKey);
	url.searchParams.set("fields", ghostFields);
	url.searchParams.set("limit", "all");
	url.searchParams.set("order", "published_at desc");
	return url.toString();
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const parseGhostPosts = (payload: unknown): GhostPostsResponse | null => {
	if (!isRecord(payload)) return null;
	const posts = payload.posts;
	if (!Array.isArray(posts)) return null;

	const normalizedPosts: GhostPost[] = [];
	for (const post of posts) {
		if (!isRecord(post)) return null;
		const id = post.id;
		const title = post.title;
		const url = post.url;
		if (typeof id !== "string" || typeof title !== "string" || typeof url !== "string") {
			return null;
		}

		const featureImage =
			typeof post.feature_image === "string" ? post.feature_image : null;
		const featureImageAlt =
			typeof post.feature_image_alt === "string" ? post.feature_image_alt : null;

		normalizedPosts.push({
			id,
			title,
			url,
			feature_image: featureImage,
			feature_image_alt: featureImageAlt,
		});
	}

	return { posts: normalizedPosts };
};

export function useGetGhostPosts() {
	const [posts, setPosts] = useState<GhostPost[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const requestIdRef = useRef(0);

	const isConfigured = Boolean(env.ghostAdminDomain && env.ghostContentApiKey);

	const fetchPosts = useCallback(
		async (signal?: AbortSignal): Promise<GhostPost[]> => {
			if (!isConfigured) return [];
			const requestId = ++requestIdRef.current;
			const canUpdate = () => requestIdRef.current === requestId;
			setLoading(true);
			setError(null);
			try {
				const url = buildGhostPostsUrl(
					env.ghostAdminDomain,
					env.ghostContentApiKey,
				);
				const response = await fetch(url, {
					headers: {
						"Accept-Version": env.ghostContentApiVersion,
					},
					signal,
				});
				if (!response.ok) {
					if (!canUpdate()) return [];
					setError(`request_failed_${response.status}`);
					setPosts([]);
					return [];
				}

				const payload: unknown = await response.json();
				const parsed = parseGhostPosts(payload);
				if (!parsed) {
					if (!canUpdate()) return [];
					setError("invalid_response");
					setPosts([]);
					return [];
				}

				if (!canUpdate()) return [];
				setPosts(parsed.posts);
				return parsed.posts;
			} catch (err) {
				if (signal?.aborted || (err instanceof DOMException && err.name === "AbortError")) {
					return [];
				}
				if (!canUpdate()) return [];
				setError("request_failed");
				setPosts([]);
				return [];
			} finally {
				if (canUpdate()) {
					setLoading(false);
				}
			}
		},
		[
			isConfigured,
			env.ghostAdminDomain,
			env.ghostContentApiKey,
			env.ghostContentApiVersion,
		],
	);

	useEffect(() => {
		if (!isConfigured) return;
		const controller = new AbortController();
		void fetchPosts(controller.signal);
		return () => controller.abort();
	}, [fetchPosts, isConfigured]);

	return { posts, loading, error, isConfigured, fetchPosts };
}
