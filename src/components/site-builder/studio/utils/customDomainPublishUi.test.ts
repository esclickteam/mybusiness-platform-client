import {
  readCustomDomainBinding,
  resolveCustomDomainPublishPhase,
  resolvePublishedSiteDisplayUrl,
  resolveMySiteCardUrls,
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

  it("My Sites card prefers active custom domain and keeps platform alternative", () => {
    const urls = resolveMySiteCardUrls({
      slug: "launchgateb12",
      publicUrl: "https://launchgateb12.sites.bizuply.com",
      domain: {
        domain: "bizuplylgtmsn7ksf50.com",
        provisioningStatus: "active",
      },
    });

    expect(urls.primaryUrl).toBe("https://bizuplylgtmsn7ksf50.com");
    expect(urls.viewUrl).toBe("https://bizuplylgtmsn7ksf50.com");
    expect(urls.platformUrl).toBe(
      "https://launchgateb12.sites.bizuply.com",
    );
    expect(urls.hasActiveCustomDomain).toBe(true);
  });

  it("My Sites card falls back to platform URL while provisioning", () => {
    const urls = resolveMySiteCardUrls({
      slug: "launchgateb12",
      publicUrl: "https://launchgateb12.sites.bizuply.com",
      domain: {
        domain: "bizuplylgtmsn7ksf50.com",
        provisioningStatus: "dns_pending",
      },
    });

    expect(urls.primaryUrl).toBe(
      "https://launchgateb12.sites.bizuply.com",
    );
    expect(urls.viewUrl).toBe("https://launchgateb12.sites.bizuply.com");
    expect(urls.hasActiveCustomDomain).toBe(false);
  });

  it("My Sites card returns to platform URL after disconnect", () => {
    const urls = resolveMySiteCardUrls({
      slug: "launchgateb12",
      publicUrl: "https://launchgateb12.sites.bizuply.com",
      domain: {
        domain: "",
        provisioningStatus: "",
      },
    });

    expect(urls.primaryUrl).toBe(
      "https://launchgateb12.sites.bizuply.com",
    );
    expect(urls.hasActiveCustomDomain).toBe(false);
  });

});
