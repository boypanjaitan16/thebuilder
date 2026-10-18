export type ProductStatus = "ACTIVE" | "NON-ACTIVE";

export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	created_at: string;
	thumbnail_url: string;
	marketplace_url: string;
	status: ProductStatus;
};
