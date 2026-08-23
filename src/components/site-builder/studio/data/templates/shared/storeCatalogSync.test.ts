import { describe, expect, it } from "vitest";

import {
  isAutoHarvestedVisualContentKey,
  isStoreBoundVisualContentKey,
  pruneAutoHarvestedVisualMaps,
} from "./storeCatalogSync";

describe("isAutoHarvestedVisualContentKey", () => {
  it("keeps explicit template field ids", () => {
    expect(isAutoHarvestedVisualContentKey("hero.image.3")).toBe(false);
    expect(isAutoHarvestedVisualContentKey("hero.title")).toBe(false);
    expect(isAutoHarvestedVisualContentKey("header.cta")).toBe(false);
  });

  it("drops store-bound and DOM-path ids", () => {
    expect(isStoreBoundVisualContentKey("products.0.image")).toBe(true);
    expect(isAutoHarvestedVisualContentKey("products.0.image")).toBe(true);
    expect(isAutoHarvestedVisualContentKey("home.hero.html-id.gallery")).toBe(true);
    expect(
      isAutoHarvestedVisualContentKey("home.gallery.image.img.0-2-4"),
    ).toBe(true);
  });
});

describe("pruneAutoHarvestedVisualMaps", () => {
  it("drops harvested keys before clone", () => {
    const pruned = pruneAutoHarvestedVisualMaps({
      __content: {
        "hero.title": { text: "Keep" },
        "home.gallery.image.img.0-2-4": { src: "x" },
        "products.0.image": { src: "y" },
      },
      __styles: {
        "hero.title": { color: "#000" },
        "home.hero.html-id.gallery": { display: "block" },
      },
    });
    expect(Object.keys(pruned.__content)).toEqual(["hero.title"]);
    expect(Object.keys(pruned.__styles)).toEqual(["hero.title"]);
  });
});
