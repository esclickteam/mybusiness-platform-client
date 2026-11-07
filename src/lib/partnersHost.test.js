import { describe, expect, it } from "vitest";
import { isGlobalPartnersHost, normalizeHostname } from "./partnersHost.mjs";

describe("partnersHost", () => {
  it("normalizes hostnames", () => {
    expect(normalizeHostname("PARTNERS.bizuply.com:443")).toBe("partners.bizuply.com");
  });

  it("detects partners.bizuply.com", () => {
    expect(isGlobalPartnersHost("partners.bizuply.com")).toBe(true);
    expect(isGlobalPartnersHost("www.partners.bizuply.com")).toBe(true);
    expect(isGlobalPartnersHost("PARTNERS.bizuply.com")).toBe(true);
    expect(isGlobalPartnersHost("bizuply.com")).toBe(false);
    expect(isGlobalPartnersHost("geo.bizuply.com")).toBe(false);
    expect(isGlobalPartnersHost("acme.bizuply.com")).toBe(false);
  });
});
