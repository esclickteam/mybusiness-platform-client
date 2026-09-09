import { describe, expect, it } from "vitest";

import {
  getStudioGalleryCatalog,
  getStudioGalleryCatalogEntry,
} from "./galleryCatalog";
import {
  getStudioTemplateLoaderKeys,
  hasStudioTemplateLoader,
  loadStudioTemplateRenderer,
} from "./loadStudioTemplate";

describe("studio gallery catalog", () => {
  it("lists built-in templates without importing renderers", () => {
    const catalog = getStudioGalleryCatalog();
    expect(catalog.length).toBeGreaterThan(80);
    expect(getStudioGalleryCatalogEntry("studiora")?.name).toBe("Studiora");
    expect(getStudioGalleryCatalogEntry("chanel")?.category).toBe("store");
    expect(getStudioGalleryCatalogEntry("aeline")?.description).toMatch(/CRM|שירות/);
  });
});

describe("lazy studio template loader", () => {
  it("knows every template folder and can load one renderer", async () => {
    const keys = getStudioTemplateLoaderKeys();
    expect(keys).toEqual(expect.arrayContaining(["studiora", "chanel", "aeline"]));
    expect(hasStudioTemplateLoader("studiora")).toBe(true);

    const renderer = await loadStudioTemplateRenderer("studiora");
    expect(renderer?.key).toBe("studiora");
    expect(typeof renderer?.Component).toBe("function");
    expect(renderer?.pages?.length).toBeGreaterThan(0);
    expect(renderer?.defaultData).toBeTruthy();
  });
});
