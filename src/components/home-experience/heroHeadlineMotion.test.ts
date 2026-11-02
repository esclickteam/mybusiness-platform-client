import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const css = readFileSync(path.join(root, "src/styles/homeExperience.css"), "utf8");
const sections = readFileSync(
  path.join(root, "src/components/home-experience/HomeExperienceSections.tsx"),
  "utf8",
);

describe("home hero headline first paint", () => {
  it("does not clip word glyphs with overflow:hidden", () => {
    const wordBlock = css.match(/\.hx-word\s*\{[^}]+\}/)?.[0] || "";
    expect(wordBlock).toContain("overflow: visible");
    expect(wordBlock).not.toContain("overflow: hidden");
  });

  it("keeps the rise animation within a readable offset", () => {
    const rise = css.match(/@keyframes hx-rise\s*\{[^}]+\}/s)?.[0] || "";
    expect(rise).toContain("translateY(0.28em)");
    expect(rise).not.toMatch(/translateY\(1\d{2}%\)/);
  });

  it("applies motion only after an explicit paint-ready class", () => {
    expect(css).toContain(".hx-word > span.hx-word__in");
    expect(sections).toContain('className={motionReady ? "hx-word__in" : undefined}');
    expect(sections).toContain("requestAnimationFrame");
  });

  it("stabilizes the display font stack to avoid late Inter reflow", () => {
    const display = css.match(/\.hx-display\s*\{[^}]+\}/)?.[0] || "";
    expect(display).toContain("Assistant, Inter, system-ui, sans-serif");
    expect(display).not.toContain("Inter, Assistant");
  });
});
