import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock crypto.randomUUID with counter for unique IDs
let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
	value: {
		randomUUID: () => `test-uuid-${++uuidCounter}-5678-9abc-def012345678`,
	},
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock import.meta.env
vi.stubGlobal("import.meta", {
	env: {
		MODE: "test",
		DEV: true,
		PROD: false,
		VITE_SUPABASE_URL: "https://test.supabase.co",
		VITE_SUPABASE_ANON_KEY: "test-anon-key",
		VITE_SUPABASE_THUMBNAIL_BUCKET: "product-thumbnails",
		VITE_FIREBASE_API_KEY: "",
		VITE_FIREBASE_PROJECT_ID: "",
		VITE_FIREBASE_APP_ID: "",
		VITE_FIREBASE_MEASUREMENT_ID: "",
	},
});
