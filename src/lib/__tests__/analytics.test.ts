import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// We need to mock the dependencies before importing the module
vi.mock("firebase/analytics", () => ({
	initializeAnalytics: vi.fn(),
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

		it("disables automatic page views", async () => {
			const { initializeAnalytics, isSupported } = await import(
				"firebase/analytics"
			);
			const { getFirebaseApp } = await import("../firebase");
			const app = {} as ReturnType<typeof getFirebaseApp>;

			vi.mocked(isSupported).mockResolvedValue(true);
			vi.mocked(getFirebaseApp).mockReturnValue(app);

			const { initAnalytics } = await import("../analytics");
			await initAnalytics();

			expect(initializeAnalytics).toHaveBeenCalledWith(app, {
				config: { send_page_view: false },
			});
		});
	});

	describe("isTrackedPath", () => {
		it.each([
			"/",
			"/insights",
			"/insights/some-slug?x=1",
			"/administration",
		])("tracks %s", async (path) => {
			const { isTrackedPath } = await import("../analytics");
			expect(isTrackedPath(path)).toBe(true);
		});

		it.each([
			"/admin",
			"/admin/",
			"/admin?x=1",
			"/admin/articles/new",
		])("does not track %s", async (path) => {
			const { isTrackedPath } = await import("../analytics");
			expect(isTrackedPath(path)).toBe(false);
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

		describe("in production mode", () => {
			beforeEach(async () => {
				vi.stubEnv("MODE", "production");
				const { initializeAnalytics, isSupported } = await import(
					"firebase/analytics"
				);
				const { getFirebaseApp } = await import("../firebase");
				vi.mocked(isSupported).mockResolvedValue(true);
				vi.mocked(getFirebaseApp).mockReturnValue(
					{} as ReturnType<typeof getFirebaseApp>,
				);
				vi.mocked(initializeAnalytics).mockReturnValue(
					{} as ReturnType<typeof initializeAnalytics>,
				);
			});

			afterEach(() => {
				vi.unstubAllEnvs();
			});

			it("logs a page_view for public pages", async () => {
				const { logEvent } = await import("firebase/analytics");
				const { trackPageView } = await import("../analytics");
				await trackPageView("/insights");

				expect(logEvent).toHaveBeenCalledWith(
					expect.anything(),
					"page_view",
					expect.objectContaining({ page_path: "/insights" }),
				);
			});

			it("skips admin pages without initializing analytics", async () => {
				const { initializeAnalytics, logEvent } = await import(
					"firebase/analytics"
				);
				const { trackPageView } = await import("../analytics");
				await trackPageView("/admin/articles/new");

				expect(initializeAnalytics).not.toHaveBeenCalled();
				expect(logEvent).not.toHaveBeenCalled();
			});
		});
	});
});
