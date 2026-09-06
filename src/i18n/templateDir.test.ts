import { describe, expect, it } from "vitest";
import {
  setTemplateLanguageOverride,
  templateDir,
} from "./templateDir";

describe("templateDir", () => {
  it("follows an embed language override instead of a leftover stored language", () => {
    setTemplateLanguageOverride("en");
    expect(templateDir()).toBe("ltr");
    setTemplateLanguageOverride("ar");
    expect(templateDir()).toBe("rtl");
    setTemplateLanguageOverride("he");
    expect(templateDir()).toBe("rtl");
    setTemplateLanguageOverride(null);
  });
});
