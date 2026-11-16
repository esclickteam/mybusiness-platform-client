import { describe, expect, it } from "vitest";
import { demoBoardText, demoTextValues } from "./demoCopy";

const hebrew = /[\u0590-\u05FF]/;

describe("demo carousel copy", () => {
  it("uses English, with no Hebrew, when the site is not Hebrew", () => {
    const values = demoTextValues(demoBoardText("en"));
    expect(values.some((value) => hebrew.test(value))).toBe(false);
    expect(values).toContain("Dashboard");
    expect(values).toContain("Book a visit");
    expect(values).toContain("Claire Bennett");
    expect(values).not.toContain("Tamar Levi");
  });

  it("uses Hebrew when the site is Hebrew", () => {
    const values = demoTextValues(demoBoardText("he"));
    expect(values.some((value) => hebrew.test(value))).toBe(true);
    expect(values).toContain("לוח בקרה");
    expect(values).not.toContain("Dashboard");
  });
});
