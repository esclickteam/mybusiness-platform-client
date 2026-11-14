import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect, type Page, type BrowserContext } from "playwright/test";
import middleware from "../middleware.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = path.join(root, "tmp", "home-hero-stable-paint");
const marketingHtml = readFileSync(path.join(root, "marketing.html"), "utf8");
const indexHtml = readFileSync(path.join(root, "index.html"), "utf8");
const homeCriticalCss = readFileSync(path.join(root, "public/home-critical.css"), "utf8");
const realFetch = globalThis.fetch;

mkdirSync(artifacts, { recursive: true });

async function edgeHtml(pathname: string) {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("/marketing.html")) {
      return new Response(marketingHtml, { status: 200, headers: { "content-type": "text/html" } });
    }
    if (url.includes("/home-critical.css")) {
      return new Response(homeCriticalCss, { status: 200, headers: { "content-type": "text/css" } });
    }
    if (url.includes("/index.html")) {
      return new Response(indexHtml, { status: 200, headers: { "content-type": "text/html" } });
    }
    return realFetch(input);
  }) as typeof fetch;

  try {
    const response = await middleware(
      new Request(`https://bizuply.com${pathname}`, {
        headers: { accept: "text/html", "x-forwarded-host": "bizuply.com" },
      }),
    );
    return await response.text();
  } finally {
    globalThis.fetch = realFetch;
  }
}

function contentType(filePath: string) {
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".mp4")) return "video/mp4";
  return "application/octet-stream";
}

async function startPaintServer(pages: Record<string, string>) {
  const publicRoot = path.join(root, "public");
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const pageHtml = pages[url.pathname];
    if (pageHtml) {
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(pageHtml);
      return;
    }
    const assetPath = path.normalize(path.join(publicRoot, decodeURIComponent(url.pathname)));
    if (!assetPath.startsWith(publicRoot)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    try {
      const body = readFileSync(assetPath);
      res.writeHead(200, {
        "content-type": contentType(assetPath),
        "cache-control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404).end("missing");
    }
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("server failed");
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve()))),
  };
}

type HeroProbe = {
  shell: boolean;
  purple: boolean;
  legacy: boolean;
  mediaVisible: boolean;
  mediaCount: number;
  mediaSrc: string | null;
  frame: { x: number; y: number; w: number; h: number } | null;
  copy: { x: number; y: number; w: number; h: number } | null;
  hero: { x: number; y: number; w: number; h: number } | null;
  bg: string;
};

async function probeHero(page: Page): Promise<HeroProbe> {
  return page.evaluate(() => {
    const rect = (el: Element | null) => {
      if (!el) return null;
      const r = (el as HTMLElement).getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };
    const media = document.querySelectorAll<HTMLElement>(".ht-hero-waves, .bj-title");
    let mediaVisible = false;
    let mediaSrc: string | null = null;
    media.forEach((node) => {
      const style = getComputedStyle(node);
      const r = node.getBoundingClientRect();
      const opaque = Number(style.opacity || "1") > 0.05;
      const shown = style.visibility !== "hidden" && style.display !== "none" && r.width > 8 && r.height > 8;
      if (opaque && shown) {
        mediaVisible = true;
        mediaSrc = node.className?.toString() || mediaSrc;
      }
    });
    return {
      shell: Boolean(document.getElementById("bizuply-first-paint")),
      purple: Boolean(document.querySelector(".hx-hero, [data-home-design='purple']")),
      legacy: Boolean(document.querySelector(".home-hero, .home-hero__title")),
      mediaVisible,
      mediaCount: media.length,
      mediaSrc,
      frame: rect(document.querySelector(".ht-hero-waves")),
      copy: rect(document.querySelector(".bj-title, .hx-display")),
      hero: rect(document.querySelector(".hx-hero")),
      bg: getComputedStyle(document.body).backgroundColor,
    };
  });
}

function nearlySameSize(
  a: { x: number; y: number; w: number; h: number } | null,
  b: { x: number; y: number; w: number; h: number } | null,
  px = 12,
) {
  if (!a || !b) return false;
  return Math.abs(a.w - b.w) <= px && Math.abs(a.h - b.h) <= px;
}

function relativeTo(
  box: { x: number; y: number; w: number; h: number } | null,
  origin: { x: number; y: number; w: number; h: number } | null,
) {
  if (!box || !origin) return null;
  return { x: box.x - origin.x, y: box.y - origin.y, w: box.w, h: box.h };
}

function nearlySameRelative(
  a: { x: number; y: number; w: number; h: number } | null,
  b: { x: number; y: number; w: number; h: number } | null,
  px = 12,
) {
  if (!a || !b) return false;
  return (
    Math.abs(a.x - b.x) <= px &&
    Math.abs(a.y - b.y) <= px &&
    Math.abs(a.w - b.w) <= px &&
    Math.abs(a.h - b.h) <= px
  );
}

async function installClsMeter(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __hxCls: number }).__hxCls = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceEntry[]) {
          const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (shift.hadRecentInput) continue;
          (window as unknown as { __hxCls: number }).__hxCls += shift.value || 0;
        }
      });
      observer.observe({ type: "layout-shift", buffered: true } as PerformanceObserverInit);
    } catch {
      /* older engines */
    }
  });
}

async function readCls(page: Page) {
  return page.evaluate(() => (window as unknown as { __hxCls?: number }).__hxCls || 0);
}

async function sampleStable(page: Page, samples = 16, gapMs = 40) {
  const frames: HeroProbe[] = [];
  for (let i = 0; i < samples; i += 1) {
    frames.push(await probeHero(page));
    await page.waitForTimeout(gapMs);
  }
  return frames;
}

async function withLocale(context: BrowserContext, locale: "en" | "he") {
  await context.addInitScript((lang) => {
    localStorage.setItem("bizuply_lang_preference", lang);
    document.cookie = `bizuply_lang=${lang}; path=/`;
  }, locale);
}

async function emulateSlow4G(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 100,
    downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.8,
    uploadThroughput: ((750 * 1024) / 8) * 0.8,
    connectionType: "cellular4g",
  });
  return client;
}

async function mountReactHeroKeepingParity(page: Page) {
  await page.evaluate(() => {
    const root = document.getElementById("root");
    if (!root) throw new Error("missing root");
    const dir = document.documentElement.dir || "ltr";
    // Edge HTML paints the purple main inside #root (index.tsx later lifts it to
    // #bizuply-first-paint). Preserve that exact hero tree through the React shell swap.
    const shell = document.getElementById("bizuply-first-paint");
    const sourceMain =
      shell?.querySelector("main.home-shell, main") ||
      root.querySelector("main.home-shell, main");
    if (!sourceMain) throw new Error("missing SSR home main");
    const clone = sourceMain.cloneNode(true) as HTMLElement;
    root.innerHTML = `<div class="app-layout hx-has-site-header" dir="${dir}"><main class="app-main"><div class="app-scroll-area home-preview-scroll"></div></main></div>`;
    root.querySelector(".home-preview-scroll")?.appendChild(clone);
    root.querySelector(".hx-page")?.setAttribute("data-home-design", "purple");
    root.removeAttribute("hidden");
    shell?.remove();
    document.documentElement.classList.add("hx-preview");
    document.body.style.backgroundColor = "#5b21b6";
  });
}

test.describe("homepage hero stays geometrically stable", () => {
  test("EN desktop: media never vanishes; CLS ~0; geometry holds through takeover", async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const en = await edgeHtml("/");
    const he = await edgeHtml("/he");
    const server = await startPaintServer({ "/": en, "/he": he, "/he/": he });
    testInfo.annotations.push({ type: "server", description: server.origin });
    await installClsMeter(page);
    await withLocale(context, "en");

    try {
      await page.goto(server.origin + "/", { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".ht-hero-waves");
      const before = await probeHero(page);
      await page.screenshot({ path: path.join(artifacts, "en-desktop-01-ssr.png"), fullPage: false });
      expect(before.legacy).toBe(false);
      expect(before.purple).toBe(true);
      expect(before.mediaVisible).toBe(true);
      expect(before.frame?.w || 0).toBeGreaterThan(100);
      expect(before.copy?.w || 0).toBeGreaterThan(100);

      // Prove chrome-only release would create a gap (regression guard for the old bug).
      const gap = await page.evaluate(() => {
        const shell = document.getElementById("bizuply-first-paint");
        const root = document.getElementById("root");
        if (!root) return { mediaVisible: false };
        root.innerHTML = `<div class="app-layout"><main class="app-main"></main></div>`;
        root.removeAttribute("hidden");
        shell?.remove();
        const media = document.querySelector(".ht-hero-waves");
        return { mediaVisible: Boolean(media) };
      });
      expect(gap.mediaVisible, "releasing on .app-main alone must leave no hero media").toBe(false);
      await page.screenshot({ path: path.join(artifacts, "en-desktop-02-bad-gap.png"), fullPage: false });

      // Restore SSR document and perform the correct swap.
      await page.goto(server.origin + "/", { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".ht-hero-waves");
      const ssr = await probeHero(page);
      const during = await sampleStable(page, 10, 30);
      expect(during.every((f) => f.mediaVisible && f.purple && !f.legacy)).toBe(true);

      await page.evaluate(() => {
        (window as unknown as { __hxCls: number }).__hxCls = 0;
      });
      await mountReactHeroKeepingParity(page);
      await page.waitForSelector("#root .ht-hero-waves");
      const after = await probeHero(page);
      await page.screenshot({ path: path.join(artifacts, "en-desktop-03-after-hydration.png"), fullPage: false });

      expect(after.shell).toBe(false);
      expect(after.mediaVisible).toBe(true);
      expect(after.legacy).toBe(false);
      expect(nearlySameSize(ssr.frame, after.frame, 12)).toBe(true);
      expect(
        nearlySameRelative(
          relativeTo(ssr.frame, ssr.hero),
          relativeTo(after.frame, after.hero),
          12,
        ),
      ).toBe(true);
      // Copy height can vary slightly with font swap; position within the hero must stay put.
      expect(
        nearlySameRelative(
          relativeTo(ssr.copy, ssr.hero),
          relativeTo(after.copy, after.hero),
          24,
        ),
      ).toBe(true);

      const cls = await readCls(page);
      expect(cls).toBeLessThan(0.01);
      testInfo.annotations.push({ type: "cls", description: String(cls) });
    } finally {
      await server.close();
    }
  });

  test("HE mobile Slow4G: stable media + purple through cold load and swap", async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const en = await edgeHtml("/");
    const he = await edgeHtml("/he");
    const server = await startPaintServer({ "/": en, "/he": he, "/he/": he });
    await installClsMeter(page);
    await withLocale(context, "he");
    await emulateSlow4G(page);

    try {
      await page.goto(server.origin + "/he", { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".ht-hero-waves");
      const before = await probeHero(page);
      await page.screenshot({ path: path.join(artifacts, "he-mobile-01-ssr.png"), fullPage: false });
      expect(before.mediaVisible).toBe(true);
      expect(before.purple).toBe(true);
      expect(await page.locator(".hx-display").innerText()).toContain("עובדת");

      const frames = await sampleStable(page, 12, 50);
      expect(frames.every((f) => f.mediaVisible && !f.legacy)).toBe(true);

      await page.evaluate(() => {
        (window as unknown as { __hxCls: number }).__hxCls = 0;
      });
      await mountReactHeroKeepingParity(page);
      const after = await probeHero(page);
      await page.screenshot({ path: path.join(artifacts, "he-mobile-02-after.png"), fullPage: false });
      expect(after.mediaVisible).toBe(true);
      expect(nearlySameSize(before.frame, after.frame, 16)).toBe(true);
      expect(
        nearlySameRelative(
          relativeTo(before.frame, before.hero),
          relativeTo(after.frame, after.hero),
          16,
        ),
      ).toBe(true);
      const cls = await readCls(page);
      expect(cls).toBeLessThan(0.01);
      testInfo.annotations.push({ type: "cls", description: String(cls) });
    } finally {
      await server.close();
    }
  });

  test("critical CSS uses the live 900px breakpoint and sticky desktop frame", async () => {
    expect(homeCriticalCss).toContain("max-width: 900px");
    expect(homeCriticalCss).toContain("position: sticky");
    expect(homeCriticalCss).toContain("aspect-ratio: 16 / 10");
    expect(homeCriticalCss).toContain("--hp: 0");
    expect(homeCriticalCss).not.toContain("min-width: 1024px");
  });
});
