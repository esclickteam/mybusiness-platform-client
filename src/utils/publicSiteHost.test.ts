import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PRODUCTION_PUBLIC_SITE_DOMAIN,
  STAGING_PUBLIC_SITE_DOMAIN,
  buildPublicSiteUrl,
  getPublicSiteDomain,
  isPublicCustomerSiteHost,
} from "./publicSiteHost";

describe("publicSiteHost", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses explicit VITE domain when set", () => {
    vi.stubEnv("VITE_BIZUPLY_PUBLIC_SITE_DOMAIN", "sites-staging.bizuply.com");
    expect(getPublicSiteDomain()).toBe(STAGING_PUBLIC_SITE_DOMAIN);
    expect(buildPublicSiteUrl("pa-e2e-final")).toBe(
      "https://pa-e2e-final.sites-staging.bizuply.com",
    );
  });

  it("falls back to staging domain from staging API URL", () => {
    vi.stubEnv("VITE_BIZUPLY_PUBLIC_SITE_DOMAIN", "");
    vi.stubEnv("VITE_API_URL", "https://server-staging-15bb.up.railway.app");
    expect(getPublicSiteDomain()).toBe(STAGING_PUBLIC_SITE_DOMAIN);
  });

  it("keeps production domain when API is production", () => {
    vi.stubEnv("VITE_BIZUPLY_PUBLIC_SITE_DOMAIN", "");
    vi.stubEnv("VITE_API_URL", "https://api.bizuply.com/api");
    expect(getPublicSiteDomain("www.bizuply.com")).toBe(
      PRODUCTION_PUBLIC_SITE_DOMAIN,
    );
    expect(buildPublicSiteUrl("shop", "www.bizuply.com")).toBe(
      "https://shop.sites.bizuply.com",
    );
  });

  it("detects public customer hosts on both platform domains", () => {
    expect(isPublicCustomerSiteHost("demo.sites.bizuply.com")).toBe(true);
    expect(isPublicCustomerSiteHost("demo.sites-staging.bizuply.com")).toBe(true);
    expect(isPublicCustomerSiteHost("www.bizuply.com")).toBe(false);
    expect(isPublicCustomerSiteHost("mybusiness-platform-client-staging.vercel.app")).toBe(false);
  });
});
