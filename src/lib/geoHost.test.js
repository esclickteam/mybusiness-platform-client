import { describe, expect, it } from "vitest";
import { isGeoIntelHost, normalizeHostname } from "./geoHost.mjs";

describe("geoHost", () => {
  it("normalizes hostnames", () => {
    expect(normalizeHostname("GEO.bizuply.com:443")).toBe("geo.bizuply.com");
  });

  it("detects geo.bizuply.com", () => {
    expect(isGeoIntelHost("geo.bizuply.com")).toBe(true);
    expect(isGeoIntelHost("www.geo.bizuply.com")).toBe(true);
    expect(isGeoIntelHost("GEO.bizuply.com")).toBe(true);
    expect(isGeoIntelHost("bizuply.com")).toBe(false);
    expect(isGeoIntelHost("api.bizuply.com")).toBe(false);
    expect(isGeoIntelHost("localhost")).toBe(false);
  });
});
