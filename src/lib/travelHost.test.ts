import { describe, expect, it } from "vitest";
import {
  TRAVEL_SEO_DESCRIPTION,
  TRAVEL_SEO_TITLE,
  isBizuplyTravelHost,
} from "./travelHost.mjs";

describe("travel host", () => {
  it("matches only the public travel subdomain", () => {
    expect(isBizuplyTravelHost("travel.bizuply.com")).toBe(true);
    expect(isBizuplyTravelHost("www.travel.bizuply.com")).toBe(true);
    expect(isBizuplyTravelHost("TRAVEL.bizuply.com")).toBe(true);
    expect(isBizuplyTravelHost("travel.bizuply.com:443")).toBe(true);
    expect(isBizuplyTravelHost("bizuply.com")).toBe(false);
    expect(isBizuplyTravelHost("www.bizuply.com")).toBe(false);
    expect(isBizuplyTravelHost("acme.bizuply.com")).toBe(false);
    expect(isBizuplyTravelHost("app.bizuply.com")).toBe(false);
    expect(isBizuplyTravelHost("travel.sites.bizuply.com")).toBe(false);
    expect(isBizuplyTravelHost("localhost")).toBe(false);
  });

  it("keeps the public SEO copy used by the landing page", () => {
    expect(TRAVEL_SEO_TITLE).toBe("Bizuply Travel | Travel Technology Platform");
    expect(TRAVEL_SEO_DESCRIPTION).toContain("Bizuply LLC");
    expect(TRAVEL_SEO_DESCRIPTION).toContain("eSIM");
  });
});
