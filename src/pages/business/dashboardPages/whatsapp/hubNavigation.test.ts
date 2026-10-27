import {
  isWhatsAppHubAllowedWhenDisconnected,
  resolveWhatsAppHubRedirect,
} from "./hubNavigation";

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
      "performance",
      "inbox",
      "insights",
      "developers",
      "billing",
      "meta-costs",
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

  it("keeps Invistimo-only extras only when the Invistimo hub flag is on", () => {
    expect(resolveWhatsAppHubRedirect(`${base}/automations`)).toBe(
      `${base}/overview`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/contacts`)).toBe(
      `${base}/overview`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/agents`)).toBe(
      `${base}/overview`
    );
    expect(resolveWhatsAppHubRedirect(`${base}/scheduled`)).toBe(
      `${base}/overview`
    );
    expect(
      resolveWhatsAppHubRedirect(`${base}/automations`, { invistimoHub: true })
    ).toBeNull();
    expect(
      resolveWhatsAppHubRedirect(`${base}/contacts`, { invistimoHub: true })
    ).toBeNull();
    expect(
      resolveWhatsAppHubRedirect(`${base}/agents`, { invistimoHub: true })
    ).toBeNull();
    expect(
      resolveWhatsAppHubRedirect(`${base}/scheduled`, { invistimoHub: true })
    ).toBeNull();
    expect(
      resolveWhatsAppHubRedirect(`${base}/nope`, { invistimoHub: true })
    ).toBe(`${base}/overview`);
  });
});

describe("isWhatsAppHubAllowedWhenDisconnected", () => {
  it("keeps setup tabs for every tenant without faking Connected", () => {
    for (const tab of ["connection", "billing", "developers", "meta-costs"]) {
      expect(isWhatsAppHubAllowedWhenDisconnected(tab)).toBe(true);
    }
    expect(isWhatsAppHubAllowedWhenDisconnected("overview")).toBe(false);
    expect(isWhatsAppHubAllowedWhenDisconnected("inbox")).toBe(false);
    expect(isWhatsAppHubAllowedWhenDisconnected("templates")).toBe(false);
    expect(isWhatsAppHubAllowedWhenDisconnected("insights")).toBe(false);
  });

  it("lets the Invistimo tenant view hub modules before cutover", () => {
    for (const tab of [
      "overview",
      "inbox",
      "templates",
      "insights",
      "automations",
      "contacts",
      "agents",
      "scheduled",
    ]) {
      expect(
        isWhatsAppHubAllowedWhenDisconnected(tab, { invistimoHub: true })
      ).toBe(true);
    }
    expect(
      isWhatsAppHubAllowedWhenDisconnected("messages", { invistimoHub: true })
    ).toBe(false);
    expect(
      isWhatsAppHubAllowedWhenDisconnected("profile", { invistimoHub: true })
    ).toBe(false);
  });

  it("lets the API portal open overview only", () => {
    expect(
      isWhatsAppHubAllowedWhenDisconnected("overview", { apiPortal: true })
    ).toBe(true);
    expect(
      isWhatsAppHubAllowedWhenDisconnected("inbox", { apiPortal: true })
    ).toBe(false);
  });
});
