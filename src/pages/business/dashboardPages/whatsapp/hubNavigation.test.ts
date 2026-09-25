import { resolveWhatsAppHubRedirect } from "./hubNavigation";

describe("resolveWhatsAppHubRedirect", () => {
  const base = "/business/biz-1/dashboard/whatsapp";

  it("redirects bare whatsapp root to overview", () => {
    expect(resolveWhatsAppHubRedirect(base)).toBe(`${base}/overview`);
    expect(resolveWhatsAppHubRedirect(`${base}/`)).toBe(`${base}/overview`);
  });

  it("does not redirect valid top-level tabs", () => {
    for (const tab of [
      "overview",
      "profile",
      "templates",
      "messages",
      "inbox",
      "insights",
      "developers",
      "billing",
      "connection",
    ]) {
      expect(resolveWhatsAppHubRedirect(`${base}/${tab}`)).toBeNull();
    }
  });

  it("does not rewrite nested messages routes (regression)", () => {
    expect(resolveWhatsAppHubRedirect(`${base}/messages/compose`)).toBeNull();
    expect(resolveWhatsAppHubRedirect(`${base}/messages/lists`)).toBeNull();
    expect(resolveWhatsAppHubRedirect(`${base}/messages/history`)).toBeNull();
  });

  it("rewrites legacy top-level compose/lists/history only", () => {
    expect(resolveWhatsAppHubRedirect(`${base}/compose`)).toBe(
      `${base}/messages/compose`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/lists`)).toBe(
      `${base}/messages/lists`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/history`)).toBe(
      `${base}/messages/history`
    );
  });

  it("rewrites other legacy top-level tabs", () => {
    expect(resolveWhatsAppHubRedirect(`${base}/settings`)).toBe(
      `${base}/connection`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/health`)).toBe(
      `${base}/insights`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/automations`)).toBe(
      `${base}/overview`
    );
  });

  it("sends unknown top-level segments to overview", () => {
    expect(resolveWhatsAppHubRedirect(`${base}/nope`)).toBe(`${base}/overview`);
  });
});
