import { describe, expect, it } from "vitest";
import {
  buildStudioPublicSiteUrl,
  normalizeStudioPublicSlug,
  resolveVitePublicSiteDomain,
  shouldCommitPublishUi,
} from "./studioPublicSiteUrl";
import {
  resolveEdgePublicSiteDomain,
  resolvePublicApiOrigin,
} from "../../publicSiteEdgeConfig.js";

describe("studioPublicSiteUrl", () => {
  it("uses VITE_BIZUPLY_PUBLIC_SITE_DOMAIN and never invents sites.bizuply.com on staging", () => {
    expect(
      resolveVitePublicSiteDomain({
        VITE_APP_ENV: "staging",
        VITE_BIZUPLY_PUBLIC_SITE_DOMAIN: "sites-staging.bizuply.com",
      }),
    ).toBe("sites-staging.bizuply.com");

    expect(
      resolveVitePublicSiteDomain({
        VITE_APP_ENV: "staging",
      }),
    ).toBe("sites-staging.invalid");

    expect(
      buildStudioPublicSiteUrl("audit-site", "sites-staging.bizuply.com"),
    ).toBe("https://audit-site.sites-staging.bizuply.com");

    expect(
      buildStudioPublicSiteUrl("audit-site", "sites-staging.bizuply.com"),
    ).not.toContain("sites.bizuply.com");
  });

  it("does not create object-object URLs for non-string slug values", () => {
    expect(normalizeStudioPublicSlug({})).toBe("");
    expect(normalizeStudioPublicSlug({ slug: { nested: true } })).toBe("");
    expect(normalizeStudioPublicSlug("[object Object]")).toBe("");
    expect(buildStudioPublicSiteUrl({})).toBe("");
    expect(buildStudioPublicSiteUrl({ foo: 1 }, "sites-staging.invalid")).toBe(
      "",
    );
    expect(buildStudioPublicSiteUrl("ok-slug", "sites-staging.invalid")).toBe(
      "https://ok-slug.sites-staging.invalid",
    );
  });

  it("does not commit publish UI on API failure (403)", () => {
    expect(shouldCommitPublishUi(false)).toBe(false);
    expect(shouldCommitPublishUi(true)).toBe(true);
  });
});

describe("publicSiteEdgeConfig / middleware API", () => {
  it("staging middleware never resolves api.bizuply.com", () => {
    const staging = resolvePublicApiOrigin({
      VITE_APP_ENV: "staging",
      VITE_API_URL: "https://server-staging-15bb.up.railway.app/api",
    });
    expect(staging.apiOrigin).toBe("https://server-staging-15bb.up.railway.app");
    expect(staging.apiOrigin).not.toContain("api.bizuply.com");

    const leaked = resolvePublicApiOrigin({
      VITE_APP_ENV: "staging",
      VITE_API_URL: "https://api.bizuply.com/api",
    });
    expect(leaked.apiOrigin).not.toContain("api.bizuply.com");
    expect(leaked.source).toBe("staging-fallback");
  });

  it("production can still use api.bizuply.com fallback", () => {
    const prod = resolvePublicApiOrigin({
      VITE_APP_ENV: "production",
    });
    expect(prod.apiOrigin).toBe("https://api.bizuply.com");
  });

  it("edge public domain prefers staging env", () => {
    expect(
      resolveEdgePublicSiteDomain({
        BIZUPLY_PUBLIC_SITE_DOMAIN: "sites-staging.bizuply.com",
      }),
    ).toBe("sites-staging.bizuply.com");
  });

  it("edge staging refuses BIZUPLY_PUBLIC_SITE_DOMAIN=sites.bizuply.com", () => {
    expect(
      resolveEdgePublicSiteDomain({
        VITE_APP_ENV: "staging",
        BIZUPLY_PUBLIC_SITE_DOMAIN: "sites.bizuply.com",
        STAGING_PUBLIC_SITE_DOMAIN: "sites-staging.bizuply.com",
      }),
    ).toBe("sites-staging.bizuply.com");

    expect(
      resolveEdgePublicSiteDomain({
        VITE_APP_ENV: "staging",
        BIZUPLY_PUBLIC_SITE_DOMAIN: "sites.bizuply.com",
      }),
    ).toBe("sites-staging.invalid");
  });
});