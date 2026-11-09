import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import middleware from "../../middleware.js";

const indexHtml = readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
const marketingHtml = readFileSync(path.resolve(process.cwd(), "marketing.html"), "utf8");
const homeCriticalCss = readFileSync(path.resolve(process.cwd(), "public/home-critical.css"), "utf8");
const realFetch = globalThis.fetch;

function rootInner(html: string) {
  const start = html.indexOf('<div id="root">');
  const popup = html.indexOf('<div id="popup-root">');
  if (start === -1) return "MISSING";
  const end = popup === -1 ? html.indexOf("</body>") : popup;
  return html.slice(start + '<div id="root">'.length, end);
}

function noscriptCrawl(html: string) {
  const match = html.match(/<noscript id="bizuply-crawl">([\s\S]*?)<\/noscript>/);
  return match ? match[1] : "";
}

function visibleH1Count(html: string) {
  const withoutNoscript = html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
  return (withoutNoscript.match(/<h1\b/gi) || []).length;
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

function serveLocalShell() {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("/marketing.html")) {
      return new Response(marketingHtml, {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    }
    if (url.includes("/home-critical.css")) {
      return new Response(homeCriticalCss, {
        status: 200,
        headers: { "content-type": "text/css" },
      });
    }
    if (url.includes("/index.html")) {
      return new Response(indexHtml, {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    }
    return realFetch(input);
  }) as typeof fetch;
}

async function documentFor(url: string, host: string) {
  serveLocalShell();
  const response = await middleware(
    new Request(url, {
      headers: { accept: "text/html", "x-forwarded-host": host },
    }),
  );
  return { status: response.status, headers: response.headers, body: await response.text() };
}

describe("first paint document shell", () => {
  it("does not hide a second document in the static shell", () => {
    expect(indexHtml).toContain('<div id="bizuply-crawl"></div>');
    expect(indexHtml).toContain('<div id="root"></div>');
    expect(indexHtml).not.toContain("clip-path: inset(50%)");
    expect(rootInner(indexHtml)).not.toContain("<h1");
    expect(indexHtml).not.toContain("The official website is bizuply.com");
  });

  it("paints one designed homepage H1 and keeps GEO copy in metadata, not a hidden dump", async () => {
    const page = await documentFor("https://bizuply.com/", "bizuply.com");
    expect(page.status).toBe(200);
    expect(page.headers.get("x-bizuply-seo-edge")).toBe("marketing");
    expect(page.body).toContain("<title>BizUply | CRM, lead management, WhatsApp Business API and business tools</title>");
    expect(page.body).toContain('rel="canonical" href="https://bizuply.com/"');
    expect(page.body).toContain('"@type":"Organization"');
    expect(page.body).toContain('"alternateName":["BizUply","Bizuply","ביזאפלי"]');
    expect(page.body).toContain('"name":"BizUply"');
    expect(page.body).toContain("In Hebrew, the brand name is ביזאפלי.");
    expect(page.body).toContain('class="hx-hero"');
    expect(page.body).toContain('data-home-design="purple"');
    expect(page.body).toContain('class="hx-display"');
    expect(page.body).toContain(">Your</span>");
    expect(page.body).toContain(">possibilities.</span>");
    expect(page.body).not.toContain('class="home-hero"');
    expect(page.body).not.toContain("home-hero__title");
    expect(page.body).not.toContain("#070b18");
    expect(visibleH1Count(page.body)).toBe(1);
    expect(noscriptCrawl(page.body)).toContain('class="home-crawl"');
    expect(rootInner(page.body)).not.toContain('class="home-crawl"');
    expect(rootInner(page.body)).toContain("hx-display");
    expect(rootInner(page.body)).toContain(">Your</span>");
    expect(rootInner(page.body)).toContain(">possibilities.</span>");
    expect(rootInner(page.body)).not.toContain("The official website is bizuply.com");
    expect(rootInner(page.body)).not.toContain("<h1>Bizuply</h1>");
    expect(page.body).not.toContain("position:absolute;width:1px;height:1px");
  });

  it("defers Vite app CSS on home so purple critical CSS can first-paint immediately", async () => {
    const withAssets = marketingHtml.replace(
      "</head>",
      '<script type="module" crossorigin src="/assets/index-TEST.js"></script><link rel="stylesheet" crossorigin href="/assets/index-TEST.css"></head>',
    );
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url.includes("/marketing.html")) {
        return new Response(withAssets, { status: 200, headers: { "content-type": "text/html" } });
      }
      if (url.includes("/home-critical.css")) {
        return new Response(homeCriticalCss, { status: 200, headers: { "content-type": "text/css" } });
      }
      if (url.includes("/index.html")) {
        return new Response(indexHtml, { status: 200, headers: { "content-type": "text/html" } });
      }
      return realFetch(input);
    }) as typeof fetch;

    const response = await middleware(
      new Request("https://bizuply.com/", {
        headers: { accept: "text/html", "x-forwarded-host": "bizuply.com" },
      }),
    );
    const body = await response.text();
    expect(body).toContain('class="bizuply-home hx-preview"');
    expect(body).toContain('style="background:#5b21b6"');
    expect(body).toContain('id="home-critical"');
    expect(body).toMatch(/href="\/assets\/index-TEST\.css"[^>]*media="print"/);
    expect(body).not.toContain("onload=\"this.media='all'\"");
    expect(body).toContain('src="/home-css-promote.js"');
    const deferred = body.match(
      /<link\b[^>]*href="\/assets\/index-TEST\.css"[^>]*media="print"[^>]*>/g,
    );
    expect(deferred?.length).toBe(1);
    expect(body).toContain('<noscript><link rel="stylesheet" href="/assets/index-TEST.css"></noscript>');
  });

  it("does not defer Vite CSS on non-home marketing routes", async () => {
    const withAssets = marketingHtml.replace(
      "</head>",
      '<link rel="stylesheet" crossorigin href="/assets/index-TEST.css"></head>',
    );
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url.includes("/marketing.html")) {
        return new Response(withAssets, { status: 200, headers: { "content-type": "text/html" } });
      }
      if (url.includes("/home-critical.css")) {
        return new Response(homeCriticalCss, { status: 200, headers: { "content-type": "text/css" } });
      }
      if (url.includes("/index.html")) {
        return new Response(indexHtml, { status: 200, headers: { "content-type": "text/html" } });
      }
      return realFetch(input);
    }) as typeof fetch;

    // /crm uses the marketing shell; home-only deferral must not apply.
    const crm = await middleware(
      new Request("https://bizuply.com/crm", {
        headers: { accept: "text/html", "x-forwarded-host": "bizuply.com" },
      }),
    );
    const body = await crm.text();
    expect(body).not.toContain("/home-css-promote.js");
    expect(body).not.toContain('media="print"');
    expect(body).not.toContain('class="bizuply-home');
    expect(body).toContain("/home-critical.css");
    expect(body).toContain('class="site-header"');
    expect(body).not.toContain('id="home-critical"');
    expect(body).toContain("CRM for leads and customers | BizUply");
  });

  it("keeps Hebrew homepage visual and CRM copy in noscript without a second visible H1", async () => {
    const hebrew = await documentFor("https://bizuply.com/he/", "bizuply.com");
    expect(hebrew.body).toContain('lang="he" dir="rtl"');
    expect(hebrew.body).toContain(">כל</span>");
    expect(hebrew.body).toContain(">אחת.</span>");
    expect(hebrew.body).toContain(">אפשרויות.</span>");
    expect(hebrew.body).toContain("ביזאפלי");
    expect(visibleH1Count(hebrew.body)).toBe(1);
    expect(noscriptCrawl(hebrew.body)).toContain('class="home-crawl"');
    expect(rootInner(hebrew.body)).not.toContain('class="home-crawl"');
    expect(rootInner(hebrew.body)).toContain("hx-display");
    expect(rootInner(hebrew.body)).toContain('data-home-design="purple"');
    expect(rootInner(hebrew.body)).not.toContain("home-hero__title");
    expect(rootInner(hebrew.body)).not.toContain("<h1>Bizuply</h1>");

    const crm = await documentFor("https://bizuply.com/crm", "bizuply.com");
    expect(crm.body).toContain("<title>CRM for leads and customers | BizUply</title>");
    expect(crm.body).toContain("<h1>A CRM that connects leads, customers and everyday work</h1>");
    expect(crm.body).toContain('href="https://bizuply.com/crm"');
    expect(crm.body).toContain('"@type":"BreadcrumbList"');
    expect(visibleH1Count(crm.body)).toBe(0);
    expect(rootInner(crm.body)).not.toContain("<h1");
    expect(noscriptCrawl(crm.body)).toContain("<h2>Frequently asked questions about CRM software</h2>");
    expect(noscriptCrawl(crm.body)).toContain("CRM only is $49 per month");

    const hebrewCrm = await documentFor("https://bizuply.com/he/crm", "bizuply.com");
    expect(hebrewCrm.body).toContain("<h1>מערכת CRM שמחברת בין הלידים, הלקוחות והעבודה היומיומית</h1>");
    expect(hebrewCrm.body).toContain('href="https://bizuply.com/he/crm"');
    expect(visibleH1Count(hebrewCrm.body)).toBe(0);
    expect(rootInner(hebrewCrm.body)).not.toContain("כל ליד");
    expect(noscriptCrawl(hebrewCrm.body)).toContain("כל ליד");
  });

  it("does not paint the WhatsApp summary inside #root", async () => {
    const page = await documentFor("https://whatsapp.bizuply.com/", "whatsapp.bizuply.com");
    expect(page.status).toBe(200);
    expect(page.headers.get("x-bizuply-seo-edge")).toBe("whatsapp");
    expect(page.body).toContain("<h1>WhatsApp API. Built for Your Business.</h1>");
    expect(page.body).toContain("$29 per month for one connected WhatsApp number");
    expect(visibleH1Count(page.body)).toBe(0);
    expect(rootInner(page.body)).not.toContain("<h1");
    expect(noscriptCrawl(page.body)).toContain("There is no free trial.");
    expect(page.body).toContain('rel="canonical" href="https://whatsapp.bizuply.com/"');
  });
});
