import {
  readCustomDomainBinding,
  resolveCustomDomainPublishPhase,
  resolvePublishedSiteDisplayUrl,
} from "./customDomainPublishUi";

describe("customDomainPublishUi", () => {
  it("treats active and empty BYOD status as primary custom URL", () => {
    expect(resolveCustomDomainPublishPhase("idoeshet.net", "active")).toBe(
      "active",
    );
    expect(resolveCustomDomainPublishPhase("idoeshet.net", "")).toBe("active");
    expect(
      resolvePublishedSiteDisplayUrl({
        customDomain: "idoeshet.net",
        provisioningStatus: "active",
        publicUrl: "https://shop.sites.bizuply.com",
        slug: "shop",
      }),
    ).toBe("https://idoeshet.net");
  });

  it("keeps platform URL while provisioning or failed", () => {
    expect(
      resolveCustomDomainPublishPhase("idoeshet.net", "verifying"),
    ).toBe("provisioning");
    expect(
      resolveCustomDomainPublishPhase("idoeshet.net", "ssl_failed"),
    ).toBe("failed");
    expect(
      resolvePublishedSiteDisplayUrl({
        customDomain: "idoeshet.net",
        provisioningStatus: "dns_pending",
        publicUrl: "https://shop.sites.bizuply.com",
        domainUrl: "https://idoeshet.net",
        slug: "shop",
      }),
    ).toBe("https://shop.sites.bizuply.com");
    expect(
      resolvePublishedSiteDisplayUrl({
        customDomain: "idoeshet.net",
        provisioningStatus: "verification_failed",
        slug: "shop",
      }),
    ).toBe("https://shop.sites.bizuply.com");
  });

  it("falls back to platform URL when disconnected", () => {
    expect(resolveCustomDomainPublishPhase("", "active")).toBe("none");
    expect(
      resolvePublishedSiteDisplayUrl({
        customDomain: "",
        provisioningStatus: "",
        slug: "shop",
      }),
    ).toBe("https://shop.sites.bizuply.com");
  });

  it("reads binding from server site payload", () => {
    expect(
      readCustomDomainBinding({
        domain: {
          domain: "idoeshet.net",
          provisioningStatus: "active",
        },
      }),
    ).toEqual({
      domain: "idoeshet.net",
      provisioningStatus: "active",
    });
  });
});