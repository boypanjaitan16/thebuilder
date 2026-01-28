/**
 * Type-safe environment variable helper
 * Centralizes all environment variable access for better security and maintainability
 */

const getEnvVar = (key: string, required = true): string => {
	const value = import.meta.env[key];
	if (required && !value && import.meta.env.MODE === "production") {
		// biome-ignore lint/suspicious/noConsole: OK
		console.error(`Missing required environment variable: ${key}`);
	}
	return value || "";
};

export const env = {
	// Supabase
	supabaseUrl: getEnvVar("VITE_SUPABASE_URL"),
	supabaseAnonKey: getEnvVar("VITE_SUPABASE_ANON_KEY"),
	thumbnailBucket:
		getEnvVar("VITE_SUPABASE_THUMBNAIL_BUCKET", false) || "product-thumbnails",

	// Firebase
	firebaseApiKey: getEnvVar("VITE_FIREBASE_API_KEY", false),
	firebaseAuthDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN", false),
	firebaseProjectId: getEnvVar("VITE_FIREBASE_PROJECT_ID", false),
	firebaseStorageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET", false),
	firebaseMessagingSenderId: getEnvVar(
		"VITE_FIREBASE_MESSAGING_SENDER_ID",
		false,
	),
	firebaseAppId: getEnvVar("VITE_FIREBASE_APP_ID", false),
	firebaseMeasurementId: getEnvVar("VITE_FIREBASE_MEASUREMENT_ID", false),

	// App
	mode: import.meta.env.MODE,
	isDev: import.meta.env.DEV,
	isProd: import.meta.env.PROD,
} as const;

// Validation constants for file uploads
export const fileUploadConfig = {
	allowedImageTypes: [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
	] as const,
	maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
	maxFileSizeMB: 5,
} as const;

// Validation constants for IDs
export const validationConfig = {
	// UUID v4 pattern
	uuidPattern:
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
	maxIdLength: 36,
} as const;

/**
 * Validates if a string is a valid UUID v4
 */
export function isValidUUID(id: string): boolean {
	if (!id || typeof id !== "string") return false;
	if (id.length > validationConfig.maxIdLength) return false;
	return validationConfig.uuidPattern.test(id);
}

/**
 * Validates file for upload
 */
export function validateFileUpload(file: File): {
	valid: boolean;
	error?: string;
} {
	if (!file) {
		return { valid: false, error: "No file provided" };
	}

	if (
		!fileUploadConfig.allowedImageTypes.includes(
			file.type as (typeof fileUploadConfig.allowedImageTypes)[number],
		)
	) {
		return {
			valid: false,
			error: `Invalid file type. Allowed types: ${fileUploadConfig.allowedImageTypes.join(", ")}`,
		};
	}

	if (file.size > fileUploadConfig.maxFileSizeBytes) {
		return {
			valid: false,
			error: `File too large. Maximum size is ${fileUploadConfig.maxFileSizeMB}MB`,
		};
	}

	return { valid: true };
}
