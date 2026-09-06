import { describe, expect, it } from "vitest";
import {
  localizeBuiltInTemplateSeed,
  localizeBuiltInText,
} from "./localizeBuiltInTemplateSeed";

describe("localizeBuiltInTemplateSeed", () => {
  it("keeps Hebrew source when the dashboard language is Hebrew", () => {
    expect(localizeBuiltInText("צור קשר", "he")).toBe("צור קשר");
  });

  it("translates built-in demo phrases without touching unknown customer copy", () => {
    expect(localizeBuiltInText("צור קשר", "en")).toBe("Contact");
    expect(localizeBuiltInText("Custom headline from the client", "en")).toBe(
      "Custom headline from the client",
    );
  });

  it("replaces longer phrases before shorter ones", () => {
    expect(localizeBuiltInText("שאלות נפוצות", "en")).toBe("FAQ");
  });

  it("walks nested default seed objects", () => {
    expect(
      localizeBuiltInTemplateSeed(
        { nav: { contact: "צור קשר" }, title: "שירותים" },
        "es",
      ),
    ).toEqual({ nav: { contact: "Contacto" }, title: "Servicios" });
  });

  it("localizes a restaurant template seed for each dashboard language", () => {
    const seed = {
      heroEyebrow: "פיצה · תנור עצים",
      heroPrimary: "הזמינו פיצה",
      navContact: "צור קשר",
    };
    expect(localizeBuiltInTemplateSeed(seed, "en").heroPrimary).toBe("Order pizza");
    expect(localizeBuiltInTemplateSeed(seed, "es").navContact).toBe("Contacto");
    expect(localizeBuiltInTemplateSeed(seed, "pt-BR").heroEyebrow).toBe("Pizza · forno a lenha");
    expect(localizeBuiltInTemplateSeed(seed, "ar").heroPrimary).toBe("اطلبوا البيتزا");
    expect(localizeBuiltInTemplateSeed(seed, "he").heroPrimary).toBe("הזמינו פיצה");
  });

  it("uses quality lexicon copy instead of leftover-Hebrew phrasebook rows", () => {
    expect(localizeBuiltInText("הזמינו פיצה", "en")).toBe("Order pizza");
    expect(localizeBuiltInText("פיצה · תנור עצים", "en")).toBe("Pizza · wood oven");
    expect(localizeBuiltInText("הזמינו פיצה", "ar")).toBe("اطلبوا البيتزا");
  });

  it("uses the generated exact lexicon for gallery template descriptions", () => {
    expect(
      localizeBuiltInText(
        "תבנית פיצרייה: הירו באלכסון עם פיצה מסתובבת, תפריט כבלוקי משולשים, רצועת חום תנור וטופס כרטיס הזמנה — אבק קמח ואנימציית stretch.",
        "en",
      ),
    ).toMatch(/pizzeria template/i);
  });
});
