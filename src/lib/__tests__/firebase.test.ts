import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock firebase/app
vi.mock("firebase/app", () => ({
	getApps: vi.fn(),
	initializeApp: vi.fn(),
}));

vi.mock("../env", () => ({
	env: {
		firebaseApiKey: "test-api-key",
		firebaseAuthDomain: "test.firebaseapp.com",
		firebaseProjectId: "test-project",
		firebaseStorageBucket: "test.appspot.com",
		firebaseMessagingSenderId: "123456",
		firebaseAppId: "test-app-id",
		firebaseMeasurementId: "G-TEST",
	},
}));

describe("firebase", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	describe("getFirebaseApp", () => {
		it("returns existing app if already initialized", async () => {
			const { getApps, initializeApp } = await import("firebase/app");
			const mockApp = { name: "test-app" };
			vi.mocked(getApps).mockReturnValue([mockApp] as never);

			const { getFirebaseApp } = await import("../firebase");
			const result = getFirebaseApp();

			expect(result).toBe(mockApp);
			expect(initializeApp).not.toHaveBeenCalled();
		});

		it("initializes new app when no apps exist", async () => {
			const { getApps, initializeApp } = await import("firebase/app");
			const mockApp = { name: "new-app" };
			vi.mocked(getApps).mockReturnValue([]);
			vi.mocked(initializeApp).mockReturnValue(mockApp as never);

			const { getFirebaseApp } = await import("../firebase");
			const result = getFirebaseApp();

			expect(result).toBe(mockApp);
			expect(initializeApp).toHaveBeenCalled();
		});
	});
});
