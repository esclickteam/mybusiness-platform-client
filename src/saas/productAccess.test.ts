import { describe, expect, it } from "vitest";
import { enterSystemHref, productHost, productLoginUrl } from "./productAccess";

describe("product enter-system URLs", () => {
  it("opens each product on its public domain instead of /s/{slug}", () => {
    expect(productLoginUrl("beautyflow", "qabftrialc9e3")).toBe(
      "https://beautyflow.bizuply.com/login?tenant=qabftrialc9e3"
    );
    expect(productLoginUrl("global-properties", "qagptrialc9e3")).toBe(
      "https://globalproperties.bizuply.com/en/auth/sign-in"
    );
    expect(productLoginUrl("dinevo", "qadnvtrialc9e3")).toBe("https://dinevo.bizuply.com/login");
    expect(productLoginUrl("cliny", "qaclntrialc9e3")).toBe("https://cliny.bizuply.com/login");
    expect(productLoginUrl("tableflow", "levant-room")).toBe("/s/levant-room");
  });

  it("does not treat the Dinevo marketplace shell as the product", () => {
    expect(
      enterSystemHref({
        templateSlug: "dinevo",
        publicSlug: "qadnvtrialc9e3",
        accessPath: "/s/qadnvtrialc9e3",
      })
    ).toBe("https://dinevo.bizuply.com/login");
  });

  it("strips secrets and rewrites Railway hosts", () => {
    expect(
      productLoginUrl("beautyflow", "studio", {
        candidate: "https://beautyflow-production-9f07.up.railway.app/login?tenant=real-slug&password=nope",
      })
    ).toBe("https://beautyflow.bizuply.com/login?tenant=real-slug");
    expect(productHost("beautyflow")).toBe("beautyflow.bizuply.com");
    expect(productHost("global-properties")).toBe("globalproperties.bizuply.com");
  });
});
