export const articleKeys = {
	all: ["articles"] as const,
	lists: () => [...articleKeys.all, "list"] as const,
	adminList: () => [...articleKeys.lists(), "admin"] as const,
	publishedList: () => [...articleKeys.lists(), "published"] as const,
	details: () => [...articleKeys.all, "detail"] as const,
	detail: (id: string) => [...articleKeys.details(), id] as const,
	bySlug: (slug: string) => [...articleKeys.details(), "slug", slug] as const,
};

export const productKeys = {
	all: ["products"] as const,
	lists: () => [...productKeys.all, "list"] as const,
	list: () => [...productKeys.lists()] as const,
};

export const advisoryRequestKeys = {
	all: ["advisoryRequests"] as const,
	lists: () => [...advisoryRequestKeys.all, "list"] as const,
	list: () => [...advisoryRequestKeys.lists()] as const,
};
