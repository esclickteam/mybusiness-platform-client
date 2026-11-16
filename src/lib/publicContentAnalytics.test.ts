import { readFileSync } from "node:fs";
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
  sendContentEvent,
} from "./publicContentAnalytics.mjs";
import { PUBLIC_CONTENT_ANALYTICS_RELEASED } from "./publicContentAnalyticsRelease.mjs";
import { NOTICE_VERSION } from "./trackingConsent";

describe("public content analytics", () => {
  it("stays off when the vite flag is on and the release lock is held", () => {
    const source = readFileSync("src/lib/publicContentAnalyticsRelease.mjs", "utf8");
    expect(source).toMatch(/PUBLIC_CONTENT_ANALYTICS_RELEASED = false/);
    expect(source).not.toMatch(/import\.meta|process\.env/);
    expect(PUBLIC_CONTENT_ANALYTICS_RELEASED).toBe(false);
    expect(publicContentAnalyticsEnabled({ VITE_PUBLIC_CONTENT_ANALYTICS: "" })).toBe(false);
    expect(publicContentAnalyticsEnabled({})).toBe(false);
    expect(publicContentAnalyticsEnabled({ VITE_PUBLIC_CONTENT_ANALYTICS: "1" })).toBe(false);
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

  it("does not send an event or create a visitor id while the release lock is held", () => {
    vi.stubEnv("VITE_PUBLIC_CONTENT_ANALYTICS", "1");
    const local = memoryStorage();
    const session = memoryStorage();
    let jar = "bizuply_tracking=v2:an:2026-11-07; bizuply_measure_hint=analytics";
    vi.stubGlobal("localStorage", local);
    vi.stubGlobal("sessionStorage", session);
    vi.stubGlobal("navigator", { userAgent: "desktop" });
    vi.stubGlobal("document", {
      get cookie() {
        return jar;
      },
      set cookie(value: string) {
        jar = value;
      },
      referrer: "https://www.google.com/search?q=crm&email=person@example.com",
    });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    expect(buildContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" })).toBeNull();
    sendContentEvent({ event: "guide_view", path: "/guides/what-is-a-crm" });
    forgetContentVisitor();
    expect(local.data.size).toBe(0);
    expect(contentVisitorKey()).toBe("");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(jar).not.toMatch(/bizuply_measure=/);
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
