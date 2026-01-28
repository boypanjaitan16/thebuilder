import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithMemoryRouter } from "../../test/test-utils";
import { AnalyticsTracker } from "../AnalyticsTracker";

// Mock analytics
vi.mock("../../lib/analytics", () => ({
	trackPageView: vi.fn(),
}));

import { trackPageView } from "../../lib/analytics";

const MockedTrackPageView = vi.mocked(trackPageView);

describe("AnalyticsTracker", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("tracks page view on mount", () => {
		renderWithMemoryRouter(<AnalyticsTracker />, ["/some-page"]);

		expect(MockedTrackPageView).toHaveBeenCalledWith("/some-page");
	});

	it("tracks page view with search params", () => {
		renderWithMemoryRouter(<AnalyticsTracker />, ["/search?q=test"]);

		expect(MockedTrackPageView).toHaveBeenCalledWith("/search?q=test");
	});

	it("returns null (renders nothing visible)", () => {
		const { container } = renderWithMemoryRouter(<AnalyticsTracker />);

		// AnalyticsTracker returns null, so the container should have no visible content
		expect(container.textContent).toBe("");
	});
});
