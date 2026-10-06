import type { FirebaseApp } from "firebase/app";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("firebase/app-check", () => ({
	initializeAppCheck: vi.fn(),
	ReCaptchaEnterpriseProvider: vi.fn(),
}));

vi.mock("../prerender", () => ({
	isPrerendering: vi.fn(() => false),
}));

vi.mock("../env", () => ({
	env: {
		firebaseAppCheckSiteKey: "test-site-key",
		firebaseAppCheckDebugToken: "",
	},
}));

const FAKE_APP = {} as FirebaseApp;

describe("ensureAppCheck", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	afterEach(() => {
		globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = undefined;
	});

	it("initializes App Check with reCAPTCHA Enterprise and auto refresh", async () => {
		const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import(
			"firebase/app-check"
		);
		const { ensureAppCheck } = await import("../firebaseAppCheck");

		ensureAppCheck(FAKE_APP);

		expect(ReCaptchaEnterpriseProvider).toHaveBeenCalledWith("test-site-key");
		expect(initializeAppCheck).toHaveBeenCalledWith(
			FAKE_APP,
			expect.objectContaining({ isTokenAutoRefreshEnabled: true }),
		);
	});

	it("enables debug mode in dev", async () => {
		const { ensureAppCheck } = await import("../firebaseAppCheck");

		ensureAppCheck(FAKE_APP);

		// import.meta.env.DEV is true under vitest; no pinned token → `true`
		expect(globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN).toBe(true);
	});

	it("only initializes once", async () => {
		const { initializeAppCheck } = await import("firebase/app-check");
		const { ensureAppCheck } = await import("../firebaseAppCheck");

		ensureAppCheck(FAKE_APP);
		ensureAppCheck(FAKE_APP);

		expect(initializeAppCheck).toHaveBeenCalledTimes(1);
	});

	it("skips initialization while prerendering", async () => {
		const { initializeAppCheck } = await import("firebase/app-check");
		const { isPrerendering } = await import("../prerender");
		vi.mocked(isPrerendering).mockReturnValue(true);
		const { ensureAppCheck } = await import("../firebaseAppCheck");

		ensureAppCheck(FAKE_APP);

		expect(initializeAppCheck).not.toHaveBeenCalled();
		vi.mocked(isPrerendering).mockReturnValue(false);
	});

	it("skips initialization when no site key is configured", async () => {
		vi.doMock("../env", () => ({
			env: { firebaseAppCheckSiteKey: "", firebaseAppCheckDebugToken: "" },
		}));
		const { initializeAppCheck } = await import("firebase/app-check");
		const { ensureAppCheck } = await import("../firebaseAppCheck");

		ensureAppCheck(FAKE_APP);

		expect(initializeAppCheck).not.toHaveBeenCalled();
	});
});
