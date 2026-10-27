import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import middleware from "../../middleware.js";

const indexHtml = readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
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
    expect(page.body).toContain("<title>Bizuply | All-in-One Business Management Platform &amp; CRM</title>");
    expect(page.body).toContain('rel="canonical" href="https://bizuply.com/"');
    expect(page.body).toContain('"@type":"Organization"');
    expect(page.body).toContain('"alternateName":["ביזאפלי","BizUply"]');
    expect(page.body).toContain("In Hebrew, the brand name is ביזאפלי.");
    expect(page.body).toContain('class="home-hero"');
    expect(page.body).toContain('<h1 class="home-hero__title">Everything your business needs to grow in one place</h1>');
    expect(visibleH1Count(page.body)).toBe(1);
    expect(noscriptCrawl(page.body)).toBe("");
    expect(rootInner(page.body)).toContain("home-hero__title");
    expect(rootInner(page.body)).toContain("Everything your business needs to grow in one place");
    expect(rootInner(page.body)).not.toContain("The official website is bizuply.com");
    expect(rootInner(page.body)).not.toContain("<h1>Bizuply</h1>");
    expect(page.body).not.toContain("position:absolute;width:1px;height:1px");
  });

  it("keeps Hebrew homepage visual and CRM copy in noscript without a second visible H1", async () => {
    const hebrew = await documentFor("https://bizuply.com/he/", "bizuply.com");
    expect(hebrew.body).toContain('lang="he" dir="rtl"');
    expect(hebrew.body).toContain("כל מה שהעסק שלכם צריך כדי לצמוח במקום אחד");
    expect(hebrew.body).toContain("ביזאפלי");
    expect(visibleH1Count(hebrew.body)).toBe(1);
    expect(noscriptCrawl(hebrew.body)).toBe("");
    expect(rootInner(hebrew.body)).toContain("home-hero__title");
    expect(rootInner(hebrew.body)).not.toContain("<h1>Bizuply</h1>");

    const crm = await documentFor("https://bizuply.com/crm", "bizuply.com");
    expect(crm.body).toContain("<title>CRM Software with Meta Lead Ads Integration | Bizuply</title>");
    expect(crm.body).toContain("<h1>Every lead, every client, every appointment in one place</h1>");
    expect(crm.body).toContain('href="https://bizuply.com/crm"');
    expect(crm.body).toContain('"@type":"BreadcrumbList"');
    expect(visibleH1Count(crm.body)).toBe(0);
    expect(rootInner(crm.body)).not.toContain("<h1");
    expect(noscriptCrawl(crm.body)).toContain("<h2>FAQ</h2>");
    expect(noscriptCrawl(crm.body)).toContain("CRM only is $49 per month");

    const hebrewCrm = await documentFor("https://bizuply.com/he/crm", "bizuply.com");
    expect(hebrewCrm.body).toContain("<h1>כל ליד, כל לקוח, כל פגישה במקום אחד</h1>");
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
