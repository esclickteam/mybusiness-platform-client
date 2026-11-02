import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect, type Page } from "playwright/test";
import middleware from "../middleware.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifacts = path.join(root, "e2e", "artifacts", "home-instant-purple");
const marketingHtml = readFileSync(path.join(root, "marketing.html"), "utf8");
const indexHtml = readFileSync(path.join(root, "index.html"), "utf8");
const homeCriticalCss = readFileSync(path.join(root, "public/home-critical.css"), "utf8");
const realFetch = globalThis.fetch;

mkdirSync(artifacts, { recursive: true });

async function edgeHtml(pathname: string, injectBlockingCss = true) {
  let shell = marketingHtml;
  if (injectBlockingCss) {
    shell = shell.replace(
      "</head>",
      '<link rel="stylesheet" href="/assets/index-BLOCK.css"><script type="module" src="/assets/index-BLOCK.js"></script></head>',
    );
  }
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("/marketing.html")) {
      return new Response(shell, { status: 200, headers: { "content-type": "text/html" } });
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
  return "application/octet-stream";
}

async function startServer(pages: Record<string, string>, cssDelayMs = 2500) {
  const publicRoot = path.join(root, "public");
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (url.pathname === "/assets/index-BLOCK.css") {
      setTimeout(() => {
        res.writeHead(200, {
          "content-type": "text/css; charset=utf-8",
          "cache-control": "no-store",
        });
        // Large-ish payload mimicking the Vite bundle size class.
        res.end(`/* blocked vite css */\nbody{outline:1px solid transparent}${ " ".repeat(200_000)}`);
      }, cssDelayMs);
      return;
    }
    if (url.pathname === "/assets/index-BLOCK.js") {
      res.writeHead(200, {
        "content-type": "text/javascript; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end("/* noop */");
      return;
    }
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
  if (!address || typeof address !== "object") throw new Error("server failed");
  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve()))),
  };
}

async function paintProbe(page: Page) {
  return page.evaluate(() => {
    const bg = getComputedStyle(document.body).backgroundColor;
    const rootBg = getComputedStyle(document.getElementById("root") || document.body).backgroundColor;
    const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
    const media = document.querySelector(".hx-hero-frame img, .hx-hero-frame video");
    const mr = media?.getBoundingClientRect();
    const paints = performance.getEntriesByType("paint").map((e) => ({
      name: e.name,
      startTime: e.startTime,
    }));
    return {
      bg,
      rootBg,
      htmlBg,
      purple: Boolean(document.querySelector(".hx-hero, [data-home-design='purple']")),
      legacy: Boolean(document.querySelector(".home-hero")),
      mediaVisible: Boolean(media && mr && mr.width > 8 && mr.height > 8),
      h1: (document.querySelector("h1")?.textContent || "").replace(/\s+/g, " ").trim(),
      paints,
      whiteish: [bg, rootBg, htmlBg].some((c) => c.includes("255, 255, 255") || c.includes("246, 247, 251")),
    };
  });
}

function isPurple(rgb: string) {
  return rgb.includes("91, 33, 182");
}

test.describe("homepage paints purple before Vite CSS arrives", () => {
  test("EN desktop: purple first paint while assets CSS is delayed (Slow 4G)", async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const en = await edgeHtml("/");
    const he = await edgeHtml("/he");
    expect(en).toMatch(/media="print"/);
    expect(en).toContain('id="home-critical"');
    const server = await startServer({ "/": en, "/he": he, "/he/": he }, 3000);
    testInfo.annotations.push({ type: "server", description: server.origin });

    await context.addInitScript(() => {
      localStorage.setItem("bizuply_lang_preference", "en");
      document.cookie = "bizuply_lang=en; path=/";
      (window as unknown as { __hxCls: number }).__hxCls = 0;
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as PerformanceEntry[]) {
            const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (shift.hadRecentInput) continue;
            (window as unknown as { __hxCls: number }).__hxCls += shift.value || 0;
          }
        }).observe({ type: "layout-shift", buffered: true } as PerformanceObserverInit);
      } catch {
        /* ignore */
      }
    });

    const client = await context.newCDPSession(page);
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 100,
      downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.8,
      uploadThroughput: ((750 * 1024) / 8) * 0.8,
      connectionType: "cellular4g",
    });

    const frames: Array<Awaited<ReturnType<typeof paintProbe>>> = [];
    // Start recording before navigation (Playwright video is already on in config).
    const nav = page.goto(server.origin + "/", { waitUntil: "commit" });
    // Sample as soon as document exists, before delayed CSS can finish.
    await page.waitForFunction(() => Boolean(document.querySelector(".hx-hero")));
    for (let i = 0; i < 12; i += 1) {
      frames.push(await paintProbe(page));
      await page.waitForTimeout(40);
    }
    await page.screenshot({ path: path.join(artifacts, "en-desktop-before-vite-css.png") });
    await nav;

    expect(frames.length).toBeGreaterThan(0);
    expect(frames.every((f) => f.purple && !f.legacy && !f.whiteish)).toBe(true);
    expect(frames.every((f) => isPurple(f.bg) || isPurple(f.htmlBg))).toBe(true);
    expect(frames.some((f) => f.mediaVisible)).toBe(true);
    expect(frames[0].h1.length).toBeGreaterThan(10);

    // Wait past the artificial CSS delay and confirm still purple (no white flash from CSS arrival).
    await page.waitForTimeout(3200);
    const afterCss = await paintProbe(page);
    await page.screenshot({ path: path.join(artifacts, "en-desktop-after-vite-css.png") });
    expect(afterCss.purple).toBe(true);
    expect(afterCss.whiteish).toBe(false);
    expect(isPurple(afterCss.bg) || isPurple(afterCss.htmlBg)).toBe(true);

    const cls = await page.evaluate(() => (window as unknown as { __hxCls?: number }).__hxCls || 0);
    writeFileSync(
      path.join(artifacts, "en-desktop-summary.json"),
      JSON.stringify({ frames: frames.slice(0, 3), afterCss, cls, paints: afterCss.paints }, null, 2),
    );
    // Fonts/image decode can add tiny shifts; white-flash regression would be much larger.
    expect(cls).toBeLessThan(0.1);
    await server.close();
  });

  test("HE mobile Slow4G: purple from first hero paint, no white shell", async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const en = await edgeHtml("/");
    const he = await edgeHtml("/he");
    const server = await startServer({ "/": en, "/he": he, "/he/": he }, 3000);

    await context.addInitScript(() => {
      localStorage.setItem("bizuply_lang_preference", "he");
      document.cookie = "bizuply_lang=he; path=/";
    });
    const client = await context.newCDPSession(page);
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 120,
      downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.7,
      uploadThroughput: ((750 * 1024) / 8) * 0.7,
      connectionType: "cellular4g",
    });

    await page.goto(server.origin + "/he", { waitUntil: "commit" });
    await page.waitForFunction(() => Boolean(document.querySelector(".hx-hero")));
    const early = await paintProbe(page);
    await page.screenshot({ path: path.join(artifacts, "he-mobile-before-vite-css.png") });
    expect(early.legacy).toBe(false);
    expect(early.purple).toBe(true);
    expect(early.whiteish).toBe(false);
    expect(early.h1).toContain("צריך");
    expect(isPurple(early.bg) || isPurple(early.htmlBg)).toBe(true);
    await server.close();
  });
});
