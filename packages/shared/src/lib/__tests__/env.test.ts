import { describe, expect, it } from "vitest";
import {
	fileUploadConfig,
	isValidUUID,
	validateFileUpload,
	validationConfig,
} from "../env";

describe("isValidUUID", () => {
	it("returns true for valid UUID v4", () => {
		expect(isValidUUID("123e4567-e89b-42d3-a456-426614174000")).toBe(true);
		expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
	});

	it("returns false for invalid UUID formats", () => {
		expect(isValidUUID("invalid-uuid")).toBe(false);
		expect(isValidUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(false); // wrong version
		expect(isValidUUID("123e4567-e89b-42d3-c456-426614174000")).toBe(false); // wrong variant
		expect(isValidUUID("")).toBe(false);
		expect(isValidUUID("too-short")).toBe(false);
	});

	it("returns false for null or undefined", () => {
		expect(isValidUUID(null as unknown as string)).toBe(false);
		expect(isValidUUID(undefined as unknown as string)).toBe(false);
	});

	it("returns false for non-string values", () => {
		expect(isValidUUID(123 as unknown as string)).toBe(false);
		expect(isValidUUID({} as unknown as string)).toBe(false);
	});

	it("returns false for strings exceeding max length", () => {
		const longString = "a".repeat(validationConfig.maxIdLength + 1);
		expect(isValidUUID(longString)).toBe(false);
	});

	it("is case insensitive", () => {
		expect(isValidUUID("123E4567-E89B-42D3-A456-426614174000")).toBe(true);
		expect(isValidUUID("123e4567-E89B-42d3-A456-426614174000")).toBe(true);
	});
});

describe("validateFileUpload", () => {
	it("returns valid for allowed image types", () => {
		const jpegFile = new File([""], "test.jpg", { type: "image/jpeg" });
		expect(validateFileUpload(jpegFile)).toEqual({ valid: true });

		const pngFile = new File([""], "test.png", { type: "image/png" });
		expect(validateFileUpload(pngFile)).toEqual({ valid: true });

		const webpFile = new File([""], "test.webp", { type: "image/webp" });
		expect(validateFileUpload(webpFile)).toEqual({ valid: true });

		const gifFile = new File([""], "test.gif", { type: "image/gif" });
		expect(validateFileUpload(gifFile)).toEqual({ valid: true });
	});

	it("returns error for invalid file type", () => {
		const textFile = new File([""], "test.txt", { type: "text/plain" });
		const result = validateFileUpload(textFile);

		expect(result.valid).toBe(false);
		expect(result.error).toContain("Invalid file type");
		expect(result.error).toContain(
			fileUploadConfig.allowedImageTypes.join(", "),
		);
	});

	it("returns error for file exceeding max size", () => {
		// Create a file larger than 5MB
		const largeContent = new ArrayBuffer(6 * 1024 * 1024);
		const largeFile = new File([largeContent], "large.jpg", {
			type: "image/jpeg",
		});

		const result = validateFileUpload(largeFile);

		expect(result.valid).toBe(false);
		expect(result.error).toContain("File too large");
		expect(result.error).toContain(`${fileUploadConfig.maxFileSizeMB}MB`);
	});

	it("returns error when no file provided", () => {
		const result = validateFileUpload(null as unknown as File);

		expect(result.valid).toBe(false);
		expect(result.error).toBe("No file provided");
	});

	it("accepts file at exactly max size", () => {
		const exactContent = new ArrayBuffer(fileUploadConfig.maxFileSizeBytes);
		const exactFile = new File([exactContent], "exact.jpg", {
			type: "image/jpeg",
		});

		const result = validateFileUpload(exactFile);

		expect(result.valid).toBe(true);
	});
});

describe("fileUploadConfig", () => {
	it("has correct allowed image types", () => {
		expect(fileUploadConfig.allowedImageTypes).toEqual([
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif",
		]);
	});

	it("has correct max file size", () => {
		expect(fileUploadConfig.maxFileSizeBytes).toBe(5 * 1024 * 1024);
		expect(fileUploadConfig.maxFileSizeMB).toBe(5);
	});
});

describe("validationConfig", () => {
	it("has correct max ID length", () => {
		expect(validationConfig.maxIdLength).toBe(36);
	});

	it("has UUID pattern defined", () => {
		expect(validationConfig.uuidPattern).toBeDefined();
		expect(validationConfig.uuidPattern instanceof RegExp).toBe(true);
	});
});
