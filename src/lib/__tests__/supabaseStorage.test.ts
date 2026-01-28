import { describe, expect, it } from "vitest";
import { getStoragePathFromPublicUrl } from "../supabaseStorage";

describe("getStoragePathFromPublicUrl", () => {
	const bucket = "product-thumbnails";

	it("extracts path from valid public URL", () => {
		const url = `https://supabase.co/storage/v1/object/public/${bucket}/products/image.jpg`;
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBe("products/image.jpg");
	});

	it("extracts nested path from public URL", () => {
		const url = `https://supabase.co/storage/v1/object/public/${bucket}/folder/subfolder/image.png`;
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBe("folder/subfolder/image.png");
	});

	it("returns null for URL without correct marker", () => {
		const url = "https://example.com/images/test.jpg";
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBeNull();
	});

	it("returns null for URL with different bucket", () => {
		const url =
			"https://supabase.co/storage/v1/object/public/other-bucket/image.jpg";
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBeNull();
	});

	it("handles URL with query parameters", () => {
		const url = `https://supabase.co/storage/v1/object/public/${bucket}/image.jpg?v=123`;
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBe("image.jpg?v=123");
	});

	it("handles URL with encoded characters", () => {
		const url = `https://supabase.co/storage/v1/object/public/${bucket}/my%20image.jpg`;
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBe("my%20image.jpg");
	});

	it("returns empty string for URL ending at bucket", () => {
		const url = `https://supabase.co/storage/v1/object/public/${bucket}/`;
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBe("");
	});

	it("handles different supabase domains", () => {
		const url = `https://my-project.supabase.co/storage/v1/object/public/${bucket}/image.jpg`;
		const result = getStoragePathFromPublicUrl(url, bucket);

		expect(result).toBe("image.jpg");
	});
});
