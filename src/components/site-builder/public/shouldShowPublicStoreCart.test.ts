import { describe, expect, it } from "vitest";

import {
  isStoreFeatureEnabled,
  shouldShowPublicStoreCart,
  siteHasStoreProductEvidence,
} from "./shouldShowPublicStoreCart";

describe("shouldShowPublicStoreCart", () => {
  it("does not inject cart just because a public site has a businessId (ido case)", () => {
    expect(
      shouldShowPublicStoreCart({
        businessId: "6a1c7b9c17abeea4a444f6fa",
        templateKey: "ido",
        enabledPlugins: ["accessibility", "whatsapp-float"],
      })
    ).toBe(false);
  });

  it("shows cart when the Store plugin is explicitly enabled, even with an empty catalog", () => {
    expect(
      shouldShowPublicStoreCart({
        businessId: "biz-1",
        enabledPlugins: ["store"],
        products: [],
      })
    ).toBe(true);
    expect(isStoreFeatureEnabled({ enabledPlugins: ["store"] })).toBe(true);
  });

  it("shows cart when real products exist even if the plugin flag was not persisted", () => {
    expect(
      siteHasStoreProductEvidence({
        data: {
          products: [{ _id: "p1", name: "Serum", price: 120 }],
        },
      })
    ).toBe(true);
    expect(
      shouldShowPublicStoreCart({
        businessId: "biz-1",
        enabledPlugins: [],
        data: {
          products: [{ _id: "p1", name: "Serum", price: 120 }],
        },
      })
    ).toBe(true);
  });

  it("ignores marketing copy and empty product placeholders", () => {
    expect(
      shouldShowPublicStoreCart({
        businessId: "biz-1",
        enabledPlugins: [],
        data: { products: [{ title: "" }, "חנות"] },
        pages: [{ title: "שירותים", htmlSnapshot: "צפייה בשירותים" }],
      })
    ).toBe(false);
  });
});
