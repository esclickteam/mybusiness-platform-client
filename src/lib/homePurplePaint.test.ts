import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HX_HERO_COPY, renderPurpleHomePrerender } from "./homePurplePaint.mjs";

const criticalCss = readFileSync(path.resolve(process.cwd(), "public/home-critical.css"), "utf8");

describe("sketch home first paint", () => {
  it("emits the sketch white shell with the product theater poster", () => {
    const en = renderPurpleHomePrerender("en");
    expect(en.inner).toContain('data-home-design="sketch"');
    expect(en.inner).toContain('class="hx-hero"');
    expect(en.inner).toContain('class="hx-display"');
    expect(en.inner).toContain(">Your</span>");
    expect(en.inner).toContain(">smarter.</span>");
    expect(en.inner).toContain(HX_HERO_COPY.en.start);
    expect(en.inner).toContain("/demo-media/home/theater/en-desktop.webp");
    expect(en.inner).toContain("/demo-media/home/theater/en-mobile.webp");
    expect(en.inner).toContain('class="ht-theater"');
    for (const [, label] of HX_HERO_COPY.en.processSteps) {
      expect(en.inner).toContain(`<span class="ht-tab-label">${label.replace(/&/g, "&amp;")}</span>`);
    }
    expect(en.inner).toContain(HX_HERO_COPY.en.processCopy[0][0]);
    expect(en.inner).toContain('class="site-header__end"');
    expect(en.inner).not.toContain('class="home-crawl"');
    expect(en.crawl).toContain('class="home-crawl"');
    expect(en.inner).not.toContain('class="home-hero"');
    expect(en.inner).not.toContain("home-hero__title");
    expect(en.inner).not.toContain('hx-hero-chrome');
  });

  it("keeps Hebrew hero copy aligned with the React sketch home", () => {
    const he = renderPurpleHomePrerender("he");
    expect(he.dir).toBe("rtl");
    expect(he.inner).toContain(">העסק</span>");
    expect(he.inner).toContain(">יותר.</span>");
    expect(he.inner).toContain("BizUply");
    expect(he.inner).toContain(HX_HERO_COPY.he.start);
    expect(he.inner).toContain("/demo-media/home/theater/he-desktop.webp");
    expect(he.inner).toContain("שלב 1 מתוך 6");
    expect(he.headline).toBe(`${HX_HERO_COPY.he.lineOne} ${HX_HERO_COPY.he.lineTwo}`);
  });

  it("critical CSS paints white canvas, never the legacy dark hero gradient", () => {
    expect(criticalCss).toContain("background: #ffffff");
    expect(criticalCss).toContain(".hx-hero");
    expect(criticalCss).toContain(".hx-display");
    expect(criticalCss).not.toContain(".home-hero {");
    expect(criticalCss).not.toContain("#070b18");
    expect(criticalCss).not.toContain("home-hero__title");
  });

  it("critical CSS matches sketch hero geometry", () => {
    expect(criticalCss).toContain("aspect-ratio: 16 / 9");
    expect(criticalCss).toContain("aspect-ratio: 1170 / 2532");
    expect(criticalCss).toContain("@media (max-width: 760px)");
    expect(criticalCss).toContain("--hp: 0");
    expect(criticalCss).not.toContain("min-width: 1024px");
  });

  it("critical CSS forces white on #root and #initial-bg for home", () => {
    expect(criticalCss).toContain("html.bizuply-home #root");
    expect(criticalCss).toContain("html.bizuply-home #initial-bg");
    expect(criticalCss).toContain("background: #ffffff !important");
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
