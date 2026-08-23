import { describe, expect, it } from "vitest";

import {
  getFallbackPageId,
  resolvePublicPathForPageId,
  resolveTemplatePageIdFromPath,
} from "./publicTemplatePagePath";

const storeRenderer = {
  pages: [
    { id: "home", name: "home-he", slug: "/" },
    { id: "shop", name: "shop-he", slug: "/shop-he" },
    { id: "cart", name: "cart-he", slug: "/cart-he" },
  ],
};

describe("publicTemplatePagePath", () => {
  it("maps /shop and localized slug to shop page id", () => {
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/shop")).toBe(
      "shop",
    );
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/shop-he")).toBe(
      "shop",
    );
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/")).toBe("home");
  });

  it("prefers ASCII page ids for store SPA hrefs", () => {
    expect(
      resolvePublicPathForPageId({ pages: [] }, storeRenderer, "shop"),
    ).toBe("/products");
    expect(
      resolvePublicPathForPageId({ pages: [] }, storeRenderer, "cart"),
    ).toBe("/cart");
  });

  it("maps /products to the shop page", () => {
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/products")).toBe(
      "shop",
    );
  });

  it("does not keep home activePageId when URL is /shop", () => {
    expect(
      getFallbackPageId({ id: "home" }, "/shop", storeRenderer),
    ).toBe("shop");
  });

  it("strips /he and /en before resolving template pages", () => {
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/he")).toBe("home");
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/en")).toBe("home");
    expect(resolveTemplatePageIdFromPath(storeRenderer, "/he/shop")).toBe(
      "shop",
    );
    expect(getFallbackPageId({ id: "home" }, "/en/products", storeRenderer)).toBe(
      "shop",
    );
  });
});