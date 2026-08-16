import { describe, expect, it } from "vitest";

import {
  getFallbackPageId,
  resolvePublicPathForPageId,
  resolveTemplatePageIdFromPath,
} from "./publicTemplatePagePath";

const velmoraRenderer = {
  pages: [
    { id: "home", name: "home-he", slug: "/" },
    { id: "shop", name: "shop-he", slug: "/shop-he" },
    { id: "cart", name: "cart-he", slug: "/cart-he" },
  ],
};

describe("publicTemplatePagePath", () => {
  it("maps /shop and localized slug to shop page id", () => {
    expect(resolveTemplatePageIdFromPath(velmoraRenderer, "/shop")).toBe(
      "shop",
    );
    expect(resolveTemplatePageIdFromPath(velmoraRenderer, "/shop-he")).toBe(
      "shop",
    );
    expect(resolveTemplatePageIdFromPath(velmoraRenderer, "/")).toBe("home");
  });

  it("prefers ASCII page ids for store SPA hrefs", () => {
    expect(
      resolvePublicPathForPageId({ pages: [] }, velmoraRenderer, "shop"),
    ).toBe("/products");
    expect(
      resolvePublicPathForPageId({ pages: [] }, velmoraRenderer, "cart"),
    ).toBe("/cart");
  });

  it("maps /products to the shop page", () => {
    expect(resolveTemplatePageIdFromPath(velmoraRenderer, "/products")).toBe(
      "shop",
    );
  });

  it("does not keep home activePageId when URL is /shop", () => {
    expect(
      getFallbackPageId({ id: "home" }, "/shop", velmoraRenderer),
    ).toBe("shop");
  });
});