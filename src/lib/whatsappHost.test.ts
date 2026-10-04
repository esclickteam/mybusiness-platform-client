import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  WHATSAPP_OG_IMAGE,
  WHATSAPP_SEO_DESCRIPTION,
  WHATSAPP_SEO_KEYWORDS,
  WHATSAPP_PAGE_PATHS,
  WHATSAPP_SEO_TITLE,
  buildWhatsAppSitemapXml,
  getWhatsAppPageMeta,
  isBizuplyWhatsAppHost,
  normalizeWhatsAppPath,
  shouldRenderWhatsAppLanding,
  whatsappCanonicalUrl,
  whatsappSiteBase,
} from "./whatsappHost.mjs";

describe("whatsapp host", () => {
  it("matches only the public WhatsApp API subdomain", () => {
    expect(isBizuplyWhatsAppHost("whatsapp.bizuply.com")).toBe(true);
    expect(isBizuplyWhatsAppHost("www.whatsapp.bizuply.com")).toBe(true);
    expect(isBizuplyWhatsAppHost("WHATSAPP.bizuply.com")).toBe(true);
    expect(isBizuplyWhatsAppHost("whatsapp.bizuply.com:443")).toBe(true);
    expect(isBizuplyWhatsAppHost("bizuply.com")).toBe(false);
    expect(isBizuplyWhatsAppHost("www.bizuply.com")).toBe(false);
    expect(isBizuplyWhatsAppHost("travel.bizuply.com")).toBe(false);
    expect(isBizuplyWhatsAppHost("acme.bizuply.com")).toBe(false);
    expect(isBizuplyWhatsAppHost("whatsapp.sites.bizuply.com")).toBe(false);
    expect(isBizuplyWhatsAppHost("localhost")).toBe(false);
  });

  it("keeps a localhost preview path off the public host", () => {
    expect(shouldRenderWhatsAppLanding("localhost", "/whatsapp-api")).toBe(true);
    expect(shouldRenderWhatsAppLanding("127.0.0.1", "/whatsapp-api/")).toBe(true);
    expect(shouldRenderWhatsAppLanding("localhost", "/")).toBe(false);
    expect(shouldRenderWhatsAppLanding("bizuply.com", "/whatsapp-api")).toBe(false);
    expect(shouldRenderWhatsAppLanding("whatsapp.bizuply.com", "/pricing")).toBe(true);
  });

  it("previews under /whatsapp-api on Vercel preview hosts", () => {
    expect(shouldRenderWhatsAppLanding("bizuply-git-feat.vercel.app", "/whatsapp-api/docs")).toBe(true);
    expect(shouldRenderWhatsAppLanding("bizuply-git-feat.vercel.app", "/pricing")).toBe(false);
    expect(shouldRenderWhatsAppLanding("localhost", "/whatsapp-apis")).toBe(false);
    expect(whatsappSiteBase("whatsapp.bizuply.com")).toBe("");
    expect(whatsappSiteBase("localhost")).toBe("/whatsapp-api");
  });

  it("keeps the public SEO copy used by the landing page", () => {
    expect(WHATSAPP_SEO_TITLE).toBe("WhatsApp API for Developers, Agencies & Businesses | Bizuply");
    expect(WHATSAPP_SEO_DESCRIPTION).toContain("built on Meta's WhatsApp Cloud API");
    expect(`${WHATSAPP_SEO_DESCRIPTION} ${WHATSAPP_SEO_KEYWORDS}`.toLowerCase()).not.toContain("official");
    expect(WHATSAPP_SEO_DESCRIPTION).toContain("webhooks");
    expect(WHATSAPP_SEO_DESCRIPTION).toContain("$29/month per WhatsApp number");
    expect(WHATSAPP_SEO_DESCRIPTION).toContain("Meta messaging charges are separate");
    expect(WHATSAPP_SEO_KEYWORDS).toContain("Embedded Signup");
    expect(WHATSAPP_SEO_KEYWORDS).toContain("WhatsApp API for agencies");
  });

  it("has metadata, canonical URLs and sitemap entries for every page", () => {
    expect(WHATSAPP_PAGE_PATHS).toEqual([
      "/",
      "/developers",
      "/agencies",
      "/pricing",
      "/docs",
      "/help",
      "/get-started",
      "/security",
    ]);
    expect(normalizeWhatsAppPath("/docs/?x=1#ref")).toBe("/docs");
    expect(normalizeWhatsAppPath("")).toBe("/");
    expect(getWhatsAppPageMeta("/pricing/")?.title).toContain("Pricing");
    expect(getWhatsAppPageMeta("/nope")).toBeNull();
    expect(whatsappCanonicalUrl("/")).toBe("https://whatsapp.bizuply.com/");
    expect(whatsappCanonicalUrl("/docs/")).toBe("https://whatsapp.bizuply.com/docs");
    const sitemap = buildWhatsAppSitemapXml();
    for (const p of WHATSAPP_PAGE_PATHS) expect(sitemap).toContain(`<loc>${whatsappCanonicalUrl(p)}</loc>`);
    for (const p of WHATSAPP_PAGE_PATHS) expect(getWhatsAppPageMeta(p)?.description.length).toBeLessThan(260);
  });

  it("serves page heads with og:image, and unknown paths as noindex 404s without a canonical", async () => {
    const shell = '<!doctype html><html><head><title>BizUply</title><link rel="canonical" href="https://bizuply.com" /></head><body></body></html>';
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response(shell, { status: 200, headers: { "content-type": "text/html" } })) as typeof fetch;
    try {
      const { default: middleware } = await import("../../middleware.js");
      const call = (p: string) =>
        middleware(new Request(`https://whatsapp.bizuply.com${p}`, { headers: { host: "whatsapp.bizuply.com", accept: "text/html" } }));

      const page = await call("/pricing");
      const pageHtml = await page.text();
      expect(page.status).toBe(200);
      expect(pageHtml).toContain('<link rel="canonical" href="https://whatsapp.bizuply.com/pricing" />');
      expect(pageHtml).toContain(`<meta property="og:image" content="${WHATSAPP_OG_IMAGE.url}" />`);
      expect(pageHtml).toContain('<meta name="twitter:image"');
      expect(pageHtml).not.toContain('href="https://bizuply.com"');

      const missing = await call("/no-such-page");
      const missingHtml = await missing.text();
      expect(missing.status).toBe(404);
      expect(missingHtml).not.toContain('rel="canonical"');
      expect(missingHtml).not.toContain("og:url");
      expect(missingHtml).toContain('content="noindex, follow"');
      expect(missingHtml).toContain("Page not found | Bizuply WhatsApp API");
    } finally {
      globalThis.fetch = realFetch;
    }
  });

  it("is wired through host routing, SEO, and partner exclusions", () => {
    const root = process.cwd();
    const middleware = readFileSync(path.resolve(root, "middleware.js"), "utf8");
    const app = readFileSync(path.resolve(root, "src/App.jsx"), "utf8");
    const indexHtml = readFileSync(path.resolve(root, "index.html"), "utf8");
    const partnerHost = readFileSync(path.resolve(root, "src/lib/partnerHost.mjs"), "utf8");

    expect(middleware).toContain("isBizuplyWhatsAppHost");
    expect(middleware).toContain("https://whatsapp.bizuply.com/");
    expect(middleware).toContain("WHATSAPP_OG_IMAGE");
    expect(WHATSAPP_OG_IMAGE.url).toBe("https://whatsapp.bizuply.com/whatsapp-og.png");
    expect(existsSync(path.resolve(root, "public/whatsapp-og.png"))).toBe(true);
    expect(app).toContain("shouldRenderWhatsAppLanding");
    expect(app).toContain("WhatsAppApiLanding");
    expect(indexHtml).toContain("whatsapp.bizuply.com");
    expect(partnerHost).toContain('"whatsapp"');
  });
});
