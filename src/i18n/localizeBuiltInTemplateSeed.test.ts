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
});
