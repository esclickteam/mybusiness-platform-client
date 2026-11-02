import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect, type Page } from "playwright/test";
import middleware from "../middleware.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketingHtml = readFileSync(path.join(root, "marketing.html"), "utf8");
const indexHtml = readFileSync(path.join(root, "index.html"), "utf8");
const homeCriticalCss = readFileSync(path.join(root, "public/home-critical.css"), "utf8");
const realFetch = globalThis.fetch;

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

async function assertPurpleOnly(page: Page) {
  const probe = await page.evaluate(() => {
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
    const hero = document.querySelector(".hx-hero, [data-hx-first-paint='true']");
    const legacy = document.querySelector(".home-hero, .home-hero__title, .home-stage");
    const h1 = document.querySelector("h1.hx-display, h1");
    return {
      bodyBg,
      htmlBg,
      hasPurpleHero: Boolean(hero),
      hasLegacyHero: Boolean(legacy),
      h1: h1?.textContent?.replace(/\s+/g, " ").trim() || "",
      design: document.querySelector("[data-home-design]")?.getAttribute("data-home-design") || null,
    };
  });

  expect(probe.hasLegacyHero, "legacy dark home-hero must never appear").toBe(false);
  expect(probe.hasPurpleHero, "purple hx-hero must be present").toBe(true);
  expect(probe.design).toBe("purple");
  expect(probe.h1.length).toBeGreaterThan(10);
  // rgb(91, 33, 182) === #5b21b6
  expect(probe.bodyBg).toContain("91, 33, 182");
}

async function sampleDuringLoad(page: Page, samples = 12) {
  const frames: Array<{ legacy: boolean; purple: boolean; bg: string }> = [];
  for (let i = 0; i < samples; i += 1) {
    frames.push(
      await page.evaluate(() => ({
        legacy: Boolean(document.querySelector(".home-hero, .home-hero__title")),
        purple: Boolean(document.querySelector(".hx-hero, [data-home-design='purple']")),
        bg: getComputedStyle(document.body).backgroundColor,
      })),
    );
    await page.waitForTimeout(50);
  }
  return frames;
}

test.describe("homepage first paint stays purple only", () => {
  test("EN cold load never shows the legacy dark hero", async ({ page, context }, testInfo) => {
    const en = await edgeHtml("/");
    const he = await edgeHtml("/he");
    expect(he).toContain(">צריך.</span>");
    const server = await startPaintServer({ "/": en, "/he": he, "/he/": he });
    testInfo.annotations.push({ type: "server", description: server.origin });

    try {
      // Prevent marketing.html locale bootstrap from bouncing EN ↔ HE mid-load.
      await context.addInitScript(() => {
        localStorage.setItem("bizuply_lang_preference", "en");
        document.cookie = "bizuply_lang=en; path=/";
      });
      await page.goto(server.origin + "/", { waitUntil: "domcontentloaded" });
      const frames = await sampleDuringLoad(page);
      expect(frames.every((frame) => !frame.legacy)).toBe(true);
      expect(frames.some((frame) => frame.purple)).toBe(true);
      await assertPurpleOnly(page);

      // Simulate React takeover: cinematic hx-page with hero media first, then drop SSR shell.
      await page.evaluate(() => {
        const shell = document.getElementById("bizuply-first-paint");
        const root = document.getElementById("root");
        if (root) {
          root.innerHTML = `<div class="app-layout hx-has-site-header"><main class="app-main"><div class="hx-page" data-home-design="purple"><section class="hx-hero"><div class="hx-hero-pin"><div class="hx-hero-copy"><h1 class="hx-display">Everything your business needs. One powerful platform.</h1></div><div class="hx-hero-frame"><img class="hx-hero-shot hx-hero-shot-1" src="/demo-media/home/crm.jpg" alt="" width="1600" height="1000"></div></div></section></div></main></div>`;
          root.removeAttribute("hidden");
        }
        shell?.remove();
        document.documentElement.classList.add("hx-preview");
        document.body.style.backgroundColor = "#5b21b6";
      });
      const after = await sampleDuringLoad(page, 8);
      expect(after.every((frame) => !frame.legacy)).toBe(true);
      await expect(page.locator(".hx-display")).toContainText("Everything your business needs");
    } finally {
      await server.close();
    }
  });

  test("HE + hard refresh + Slow 4G stay on purple", async ({ page, context }, testInfo) => {
    const en = await edgeHtml("/");
    const he = await edgeHtml("/he");
    expect(he).toContain(">צריך.</span>");
    const server = await startPaintServer({ "/": en, "/he": he, "/he/": he });
    testInfo.annotations.push({ type: "server", description: server.origin });

    try {
      await context.addInitScript(() => {
        localStorage.setItem("bizuply_lang_preference", "he");
        document.cookie = "bizuply_lang=he; path=/";
      });
      const client = await context.newCDPSession(page);
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 100,
        downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.8,
        uploadThroughput: ((750 * 1024) / 8) * 0.8,
        connectionType: "cellular4g",
      });

      await page.goto(server.origin + "/he", { waitUntil: "domcontentloaded" });
      await assertPurpleOnly(page);
      await expect(page.locator(".hx-display")).toContainText("צריך");
      await expect(page.locator(".hx-display")).toContainText("חזקה");

      await page.reload({ waitUntil: "domcontentloaded" });
      const frames = await sampleDuringLoad(page);
      expect(frames.every((frame) => !frame.legacy)).toBe(true);
      await assertPurpleOnly(page);
      await expect(page.locator(".hx-display")).toContainText("צריך");
    } finally {
      await server.close();
    }
  });
});
