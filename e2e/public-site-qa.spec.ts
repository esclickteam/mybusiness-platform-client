import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test, expect, type Page } from "playwright/test";
import middleware from "../middleware.js";
import { MARKETING_PAGES } from "../src/lib/marketingSeo.mjs";
import { ACTIVITY_PATHS } from "../src/lib/activityPages.mjs";
import { GUIDE_SLUGS } from "../src/lib/guidesMarketing.mjs";
import { buildHomeSessionRedirectResponse, fetchHomeSessionRedirectUrl } from "../src/lib/homeSessionRedirect.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketingHtml = readFileSync(path.join(root, "marketing.html"), "utf8");
const indexHtml = readFileSync(path.join(root, "index.html"), "utf8");
const realFetch = globalThis.fetch;
const BASE = process.env.PUBLIC_QA_BASE || "http://127.0.0.1:5173";
const OUT = path.resolve("e2e-results/public-qa");
const LOCALES = ["en", "he", "es", "pt-BR", "ar"] as const;
const VISUAL = ["/", "/about", "/pricing", "/contact", "/partners", "/faq", "/how-it-works", "/features", "/solutions", "/business", "/search"];
const WIDTHS = [390, 768, 1440];
const PATHS = (process.env.PUBLIC_QA_ONLY?.split(",").filter(Boolean)) || [...new Set([
  ...MARKETING_PAGES.map((page) => page.path),
  "/whatsapp-api",
  "/platform",
  ...ACTIVITY_PATHS,
  ...GUIDE_SLUGS.map((slug) => `/guides/${slug}`),
])];

type Row = {
  url: string;
  locale: string;
  status: number;
  edgeTitle: boolean;
  edgeDescription: boolean;
  edgeCanonical: boolean;
  edgeHreflang: boolean;
  edgeLang: boolean;
  h1: number;
  dir: string;
  overflow: boolean;
  jsErrors: string[];
  labels: boolean;
  untranslated: boolean;
  brokenImages: string[];
  notes: string[];
};

function localePath(pathname: string, locale: string) {
  if (locale === "en") return pathname;
  const prefix = locale === "pt-BR" ? "pt-br" : locale;
  return pathname === "/" ? `/${prefix}` : `/${prefix}${pathname}`;
}

async function edgeHtml(pathname: string) {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("/marketing.html")) return new Response(marketingHtml, { status: 200, headers: { "content-type": "text/html" } });
    if (url.includes("/index.html")) return new Response(indexHtml, { status: 200, headers: { "content-type": "text/html" } });
    return realFetch(input);
  }) as typeof fetch;
  try {
    return await middleware(new Request(`https://bizuply.com${pathname}`, {
      headers: { accept: "text/html", "x-forwarded-host": "bizuply.com" },
    }));
  } finally {
    globalThis.fetch = realFetch;
  }
}

function edgeFacts(html: string, locale: string) {
  const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1]?.trim() || "";
  const description = /<meta name="description" content="([^"]*)"/i.exec(html)?.[1]?.trim() || "";
  const canonical = /<link rel="canonical" href="([^"]+)"/i.exec(html)?.[1] || "";
  const hreflang = (html.match(/hreflang="/g) || []).length;
  const expected = locale === "pt-BR" ? "pt-BR" : locale;
  return {
    edgeTitle: title.length > 8 && !/\b(SEO|AEO|GEO)\b/.test(title),
    edgeDescription: description.length > 40 && !/\b(SEO|AEO|GEO)\b/.test(description),
    edgeCanonical: canonical.startsWith("https://bizuply.com") || canonical.startsWith("https://whatsapp.bizuply.com"),
    edgeHreflang: hreflang >= 2,
    edgeLang: new RegExp(`<html[^>]*lang="${expected}"`, "i").test(html),
  };
}

async function browserFacts(page: Page, locale: string) {
  return page.evaluate((expected) => {
    const text = document.body?.innerText || "";
    const englishMarks = ["Apply to Become a Partner", "Clear filters", "We would like to hear from you."];
    return {
      h1: document.querySelectorAll("h1").length,
      dir: document.querySelector("main")?.getAttribute("dir")
        || document.documentElement.dir
        || getComputedStyle(document.documentElement).direction,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      labels: /\bAEO\b|\bGEO\b|direct answer|content for AI/i.test(text),
      untranslated: expected !== "en" && englishMarks.some((mark) => text.includes(mark)),
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0 && image.currentSrc)
        .map((image) => image.currentSrc)
        .slice(0, 6),
    };
  }, locale);
}

test("public pages in five languages", async ({ browser }, testInfo) => {
  test.setTimeout(1_500_000);
  test.skip(testInfo.project.name !== "desktop-chromium", "one browser project");
  mkdirSync(OUT, { recursive: true });
  const rows: Row[] = [];

  for (const locale of LOCALES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript((language) => {
      localStorage.setItem("i18nextLng", language);
    }, locale);
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (const pathname of PATHS) {
      const urlPath = localePath(pathname, locale);
      const edge = await edgeHtml(urlPath);
      const status = edge.status;
      const location = edge.headers.get("location") || "";
      if (status >= 300 && status < 400 && location.includes("whatsapp.bizuply.com")) {
        rows.push({
          url: urlPath, locale, status, edgeTitle: true, edgeDescription: true, edgeCanonical: true,
          edgeHreflang: true, edgeLang: true, h1: 1, dir: "ltr", overflow: false, jsErrors: [],
          labels: false, untranslated: false, brokenImages: [], notes: ["redirect-whatsapp"],
        });
        continue;
      }
      const html = await edge.text();
      const head = edgeFacts(html, locale);
      errors.length = 0;
      const response = await page.goto(`${BASE}${urlPath}`, { waitUntil: "domcontentloaded" });
      await page.locator("h1").first().waitFor({ timeout: 8000 }).catch(() => {});
      const facts = await browserFacts(page, locale);
      const expectedDir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
      const notes: string[] = [];
      if ((response?.status() || 0) >= 400) notes.push("http");
      if (!head.edgeTitle) notes.push("title");
      if (!head.edgeDescription) notes.push("description");
      if (!head.edgeCanonical) notes.push("canonical");
      if (!head.edgeHreflang) notes.push("hreflang");
      if (!head.edgeLang) notes.push("lang");
      if (facts.h1 !== 1) notes.push(`h1:${facts.h1}`);
      if (facts.dir !== expectedDir) notes.push(`dir:${facts.dir}`);
      if (facts.overflow) notes.push("overflow");
      if (facts.labels) notes.push("public-label");
      if (facts.untranslated) notes.push("untranslated");
      if (facts.brokenImages.length) notes.push("image");
      if (errors.length) notes.push("js");
      rows.push({
        url: urlPath,
        locale,
        status: response?.status() || status,
        ...head,
        ...facts,
        jsErrors: [...errors],
        notes,
      });
    }

    for (const pathname of VISUAL) {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
        const target = `${BASE}${localePath(pathname, locale)}`;
        await page.goto(target, { waitUntil: "domcontentloaded" }).catch(async () => {
          await page.goto(target, { waitUntil: "domcontentloaded" });
        });
        await page.locator("h1").first().waitFor({ timeout: 8000 }).catch(() => {});
        await page.screenshot({
          path: path.join(OUT, `${locale}${pathname.replaceAll("/", "_") || "_home"}-${width}.png`),
          fullPage: false,
        });
      }
    }
    await context.close();
  }

  const failed = rows.filter((row) => row.notes.some((note) => note !== "redirect-whatsapp"));
  writeFileSync(path.join(OUT, "report.json"), JSON.stringify({
    checked: rows.length,
    failed: failed.length,
    rows: rows.map(({ jsErrors, brokenImages, ...row }) => ({
      ...row,
      jsErrors: jsErrors.slice(0, 2),
      brokenImages: brokenImages.slice(0, 2),
    })),
  }, null, 2));
  expect(failed.slice(0, 20)).toEqual([]);
});

test("guest forms, pricing, and the home session redirect stay intact", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("input[type='password'], input[name='password']").first()).toBeVisible();
  await page.goto(`${BASE}/register?plan=monthly`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("input[type='email'], input[name='email']").first()).toBeVisible();

  await page.goto(`${BASE}/pricing`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toHaveCount(1);
  const pricingText = await page.locator("body").innerText();
  expect(pricingText).toContain("99");
  expect(pricingText).toContain("990");

  await page.route("**/api/support", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true }),
  }));
  await page.goto(`${BASE}/contact`, { waitUntil: "domcontentloaded" });
  await page.locator("input[name='name']").fill("QA Public");
  await page.locator("input[name='email']").fill("qa-public@example.com");
  await page.locator("textarea[name='message']").fill("Public form check. Please ignore.");
  const phone = page.locator(".bizuply-phone-wrapper input").first();
  await phone.fill("2015550148");
  const posted = page.waitForRequest("**/api/support");
  await page.locator("button[type='submit']").click();
  const request = await posted;
  const body = request.postDataJSON() as { name?: string; email?: string };
  expect(body.name).toBe("QA Public");
  expect(body.email).toBe("qa-public@example.com");

  const homeRequest = new Request("https://bizuply.com/", {
    headers: { cookie: "refreshToken=qa-not-a-session" },
  });
  const redirect = await fetchHomeSessionRedirectUrl({
    request: homeRequest,
    host: "bizuply.com",
    fetchImpl: async () => new Response(JSON.stringify({ ok: true, redirectUrl: "/dashboard" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  });
  expect(redirect).toBe("/dashboard");
  const home = buildHomeSessionRedirectResponse(homeRequest, redirect || "");
  expect(home?.status).toBe(302);
  expect(home?.headers.get("location")).toContain("/dashboard");
});

