import { describe, expect, it } from "vitest";
import { localizeBuiltInText } from "../../i18n/templateCopy";
import {
  galleryAssetLang,
  galleryBuildPath,
  galleryDemoPath,
  galleryStageSrc,
  galleryThumbSrc,
  selectedAfterFilter,
  sitesForFilter,
} from "./websiteGallery";

describe("website gallery", () => {
  it("keeps the current site when the filter still includes it", () => {
    expect(selectedAfterFilter("adion", "studio")).toBe("adion");
    expect(sitesForFilter("studio").map((site) => site.key)).toEqual(["virello", "adion"]);
  });

  it("moves to the first site in a filter that hides the current one", () => {
    expect(selectedAfterFilter("virello", "property")).toBe("nadlanist");
    expect(sitesForFilter("property")).toHaveLength(1);
  });

  it("opens the public full-page render of the real template", () => {
    expect(galleryDemoPath("Novastra", "he")).toBe("/embed/template/novastra?lang=he&presentation=page");
    expect(galleryDemoPath("lashora", "en-US")).toBe("/embed/template/lashora?lang=en&presentation=page");
  });

  it("preselects a template only for a signed-in business or admin", () => {
    expect(galleryBuildPath("virello", "business", "biz_1")).toBe(
      "/business/biz_1/dashboard/website/templates/virello/edit",
    );
    expect(galleryBuildPath("virello", "admin", "biz_9")).toBe(
      "/business/biz_9/dashboard/website/templates/virello/edit",
    );
    expect(galleryBuildPath("virello")).toBe("/website-builder");
    expect(galleryBuildPath("virello", "customer", "biz_1")).toBe("/website-builder");
    expect(galleryBuildPath("virello", "business", "")).toBe("/website-builder");
  });

  it("uses a screenshot in the same language as the demo", () => {
    expect(galleryAssetLang("he")).toBe("he");
    expect(galleryAssetLang("en-US")).toBe("en");
    expect(galleryStageSrc("virello", "en")).toBe("/demo-media/home/gallery/virello-en-stage.webp");
    expect(galleryThumbSrc("virello", "he")).toBe("/demo-media/home/gallery/virello-he-thumb.webp");
    expect(galleryDemoPath("virello", "en")).toContain("lang=en");
    expect(galleryDemoPath("virello", "he")).toContain("lang=he");
  });

  it("translates leftover gallery lines without changing the Hebrew source", () => {
    const source = "אנחנו בונים. המותגים שלכם עפים.";
    expect(localizeBuiltInText(source, "en")).toBe("We build. Your brands take off.");
    expect(localizeBuiltInText(source, "he")).toBe(source);
  });
});
