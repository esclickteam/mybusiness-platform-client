import { describe, expect, it } from "vitest";
import ALL_CATEGORIES from "../data/categories";
import {
  BUSINESS_CATEGORY_ROWS,
  BUSINESS_CATEGORY_SLUGS,
  categoryNamesCatalog,
  translateBusinessCategory,
} from "./businessCategoryLabels";

describe("business category labels", () => {
  it("covers every stored Hebrew category", () => {
    const missing = ALL_CATEGORIES.filter((name) => !BUSINESS_CATEGORY_SLUGS[name]);
    expect(missing).toEqual([]);
    expect(BUSINESS_CATEGORY_ROWS).toHaveLength(ALL_CATEGORIES.length);
  });

  it("keeps unique slugs and builds locale catalogs", () => {
    const slugs = BUSINESS_CATEGORY_ROWS.map((row) => row[1]);
    expect(new Set(slugs).size).toBe(slugs.length);
    const english = categoryNamesCatalog("en");
    const hebrew = categoryNamesCatalog("he");
    expect(english.beautyCare).toBe("Beauty and care");
    expect(hebrew.beautyCare).toBe("יופי וטיפוח");
  });

  it("falls back to the stored Hebrew name when t is missing", () => {
    expect(translateBusinessCategory("יופי וטיפוח")).toBe("יופי וטיפוח");
  });
});
