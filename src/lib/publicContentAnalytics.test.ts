import { describe, expect, it } from "vitest";
import { classifyContentClick, classifyContentView, cleanContentPath, publicContentAnalyticsEnabled } from "./publicContentAnalytics.mjs";

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
});
