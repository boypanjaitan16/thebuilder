import { beforeEach, describe, expect, it, vi } from "vitest";

// We need to mock the dependencies before importing the module
vi.mock("firebase/analytics", () => ({
	getAnalytics: vi.fn(),
	isSupported: vi.fn(),
	logEvent: vi.fn(),
}));

vi.mock("../firebase", () => ({
	getFirebaseApp: vi.fn(),
}));

vi.mock("../env", () => ({
	env: {
		firebaseMeasurementId: "test-measurement-id",
	},
}));

describe("analytics", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	describe("initAnalytics", () => {
		it("returns null when firebaseMeasurementId is not set", async () => {
			vi.doMock("../env", () => ({
				env: {
					firebaseMeasurementId: "",
				},
			}));

			const { initAnalytics } = await import("../analytics");
			const result = await initAnalytics();

			expect(result).toBeNull();
		});

		it("returns null when analytics is not supported", async () => {
			const { isSupported } = await import("firebase/analytics");
			vi.mocked(isSupported).mockResolvedValue(false);

			vi.doMock("../env", () => ({
				env: {
					firebaseMeasurementId: "test-id",
				},
			}));

			const { initAnalytics } = await import("../analytics");
			const result = await initAnalytics();

			expect(result).toBeNull();
		});

		it("returns null when Firebase app is not available", async () => {
			const { isSupported } = await import("firebase/analytics");
			const { getFirebaseApp } = await import("../firebase");

			vi.mocked(isSupported).mockResolvedValue(true);
			vi.mocked(getFirebaseApp).mockReturnValue(null);

			vi.doMock("../env", () => ({
				env: {
					firebaseMeasurementId: "test-id",
				},
			}));

			const { initAnalytics } = await import("../analytics");
			const result = await initAnalytics();

			expect(result).toBeNull();
		});
	});

	describe("trackPageView", () => {
		it("does nothing in non-production mode", async () => {
			const { logEvent } = await import("firebase/analytics");

			// import.meta.env.MODE is 'test' in our setup
			const { trackPageView } = await import("../analytics");
			await trackPageView("/test-page");

			expect(logEvent).not.toHaveBeenCalled();
		});
	});
});
