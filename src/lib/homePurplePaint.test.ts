import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HX_HERO_COPY, renderPurpleHomePrerender } from "./homePurplePaint.mjs";

const criticalCss = readFileSync(path.resolve(process.cwd(), "public/home-critical.css"), "utf8");

describe("purple home first paint", () => {
  it("emits only the cinematic purple shell", () => {
    const en = renderPurpleHomePrerender("en");
    expect(en.inner).toContain('data-home-design="purple"');
    expect(en.inner).toContain('class="hx-hero"');
    expect(en.inner).toContain('class="hx-display"');
    expect(en.inner).toContain(">Everything</span>");
    expect(en.inner).toContain(">platform.</span>");
    expect(en.inner).toContain(HX_HERO_COPY.en.start);
    expect(en.inner).toContain("/demo-media/home/crm.jpg");
    expect(en.inner).not.toContain('class="home-hero"');
    expect(en.inner).not.toContain("home-hero__title");
    expect(en.inner).not.toContain("/demo-media/crm/poster.jpg");
  });

  it("keeps Hebrew hero copy aligned with the React cinematic home", () => {
    const he = renderPurpleHomePrerender("he");
    expect(he.dir).toBe("rtl");
    expect(he.inner).toContain(">כל</span>");
    expect(he.inner).toContain(">חזקה.</span>");
    expect(he.inner).toContain(HX_HERO_COPY.he.start);
    expect(he.headline).toBe(`${HX_HERO_COPY.he.lineOne} ${HX_HERO_COPY.he.lineTwo}`);
  });

  it("critical CSS paints purple, never the legacy dark hero gradient", () => {
    expect(criticalCss).toContain("background: #5b21b6");
    expect(criticalCss).toContain(".hx-hero");
    expect(criticalCss).toContain(".hx-display");
    expect(criticalCss).not.toContain(".home-hero {");
    expect(criticalCss).not.toContain("#070b18");
    expect(criticalCss).not.toContain("home-hero__title");
  });

  it("critical CSS matches live resting hero geometry (sticky + 900px)", () => {
    expect(criticalCss).toContain("position: sticky");
    expect(criticalCss).toContain("aspect-ratio: 16 / 10");
    expect(criticalCss).toContain("max-width: 900px");
    expect(criticalCss).toContain("--hp: 0");
    expect(criticalCss).not.toContain("min-width: 1024px");
  });

  it("critical CSS forces purple on #root and #initial-bg for home", () => {
    expect(criticalCss).toContain("html.bizuply-home #root");
    expect(criticalCss).toContain("html.bizuply-home #initial-bg");
    expect(criticalCss).toContain("background: #5b21b6 !important");
  });

  it("critical CSS keeps border-box after hydration replaces .home-shell", () => {
    expect(criticalCss).toContain("html.bizuply-home *");
    expect(criticalCss).toContain("box-sizing: border-box");
    expect(criticalCss).not.toContain(".home-shell *");
    expect(criticalCss).toContain("font-size: 0.78rem");
    expect(criticalCss).toMatch(/\.hx-display\s*\{[^}]*margin:\s*0;/);
    expect(criticalCss).toContain(".hx-skip");
    expect(criticalCss).toContain("overflow: visible");
    expect(criticalCss).toContain("html.bizuply-home .app-scroll-area");
    expect(criticalCss).not.toMatch(/(?:^|\n)\.app-scroll-area\s*,/);
  });
});
