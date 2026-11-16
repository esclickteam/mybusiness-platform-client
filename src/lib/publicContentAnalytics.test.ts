import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_NOTICE_VERSION,
  buildContentEvent,
  classifyContentClick,
  classifyContentView,
  cleanContentPath,
  consentGrantsAnalytics,
  contentVisitorKey,
  forgetContentVisitor,
  publicContentAnalyticsEnabled,
} from "./publicContentAnalytics.mjs";
import { NOTICE_VERSION } from "./trackingConsent";

describe("public content analytics", () => {
  it("stays off unless the flag is exactly on", () => {
    expect(publicContentAnalyticsEnabled({ VITE_PUBLIC_CONTENT_ANALYTICS: "" })).toBe(false);
    expect(publicContentAnalyticsEnabled({})).toBe(false);
    expect(publicContentAnalyticsEnabled({ VITE_PUBLIC_CONTENT_ANALYTICS: "1" })).toBe(true);
  });

  it("counts a guide and a resource path, and drops personal query strings", () => {
    expect(classifyContentView("/guides/what-is-a-crm")?.event).toBe("guide_view");
    expect(classifyContentView("/he/resources")?.event).toBe("resource_view");
    expect(classifyContentView("/pricing")).toBeNull();
    expect(cleanContentPath("/guides/what-is-a-crm?email=person@example.com")).toBe("");
  });

  it("separates a product click, a pricing click, and a template download", () => {
    expect(classifyContentClick("/guides/what-is-a-crm", "/crm")?.event).toBe("guide_product_click");
    expect(classifyContentClick("/he/guides/what-is-a-crm", "/he/pricing")?.event).toBe("pricing_click");
    expect(classifyContentClick("/resources", "/crm")).toBeNull();
    expect(classifyContentClick("/templates", "/downloads/bizuply-lead-tracker.xlsx")?.event).toBe("template_download");
  });

  it("treats only an explicit current analytics choice as consent", () => {
    expect(ANALYTICS_NOTICE_VERSION).toBe(NOTICE_VERSION);
    expect(consentGrantsAnalytics("analytics")).toBe(false);
    expect(consentGrantsAnalytics("all")).toBe(false);
    expect(consentGrantsAnalytics("essential")).toBe(false);
    expect(consentGrantsAnalytics("v2:ad:2026-11-07")).toBe(false);
    expect(consentGrantsAnalytics("v2:none:2026-11-07")).toBe(false);
    expect(consentGrantsAnalytics("v2:an:2026-11-06")).toBe(false);
    expect(consentGrantsAnalytics("v2:an:2026-11-07")).toBe(true);
    expect(consentGrantsAnalytics("v2:ad.an:2026-11-07")).toBe(true);
  });

  it("does not create a visitor id without analytics consent, and deduplicates a view", () => {
    vi.stubEnv("VITE_PUBLIC_CONTENT_ANALYTICS", "1");
    const local = memoryStorage();
    const session = memoryStorage();
    let jar = "";
    vi.stubGlobal("localStorage", local);
    vi.stubGlobal("sessionStorage", session);
    vi.stubGlobal("navigator", { userAgent: "desktop", sendBeacon: undefined });
    vi.stubGlobal("document", {
      get cookie() {
        return jar;
      },
      referrer: "https://www.google.com/search?q=crm&email=person@example.com",
    });

    expect(buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" })).toBeNull();
    expect(local.data.size).toBe(0);

    jar = "bizuply_tracking=all";
    expect(buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" })).toBeNull();
    jar = "bizuply_tracking=v2:ad:2026-11-07";
    expect(buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" })).toBeNull();
    expect(contentVisitorKey(false)).toBe("");

    jar = "bizuply_tracking=v2:an:2026-11-07";
    const first = buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm?email=person@example.com" });
    expect(first).toBeNull();
    const view = buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" });
    expect(view?.consentProof).toBeUndefined();
    expect(view).not.toHaveProperty("consent");
    expect(view?.referrer).toBe("https://www.google.com/");
    expect(view?.visitorKey).toMatch(/^[0-9a-f-]{36}$/i);
    expect(JSON.stringify(view)).not.toMatch(/email|person@/);
    expect(buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" })).toBeNull();

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    forgetContentVisitor();
    expect(contentVisitorKey(false)).toBe("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(String(fetchMock.mock.calls[0][1].body));
    expect(body.purpose).toBe("withdraw_analytics");
    expect(body.visitorKey).toBe(view?.visitorKey);
    jar = "";
    expect(buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" })).toBeNull();
    expect(contentVisitorKey(false)).toBe("");
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
    setItem: (key: string, value: string) => {
      data.set(key, String(value));
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}
