import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderPurpleHomePrerender } from "./homePurplePaint.mjs";

const criticalCss = readFileSync(path.resolve(process.cwd(), "public/home-critical.css"), "utf8");

describe("sketch home first paint", () => {
  it("emits the sketch white shell with the product theater poster", () => {
    const en = renderPurpleHomePrerender("en");
    expect(en.inner).toContain('data-home-design="sketch"');
    expect(en.inner).toContain('class="hx-hero bj-journey"');
    expect(en.inner).toContain('class="bj-title hx-display"');
    expect(en.inner).toContain(">How</span>");
    expect(en.inner).toContain(">meeting.</span>");
    expect(en.inner).toContain("THE BIZUPLY JOURNEY");
    expect(en.inner).toContain("ht-hero-waves");
    expect(en.inner).not.toContain('class="ht-theater"');
    expect(en.inner).not.toContain("/demo-media/home/theater/");
    expect(en.inner).not.toContain("Your business");
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
    expect(he.inner).toContain(">איך</span>");
    expect(he.inner).toContain(">עובדת?</span>");
    expect(he.inner).toContain(">פגישה.</span>");
    expect(he.inner).toContain("Bizuply");
    expect(he.inner).not.toContain("העסק שלכם");
    expect(he.inner).not.toContain('class="ht-theater"');
    expect(he.headline).toBe("איך Bizuply עובדת? מ-Meta ועד פגישה.");
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
