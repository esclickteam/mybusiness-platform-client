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

function crawlBlock(html: string) {
  const start = html.indexOf('<div id="bizuply-crawl"');
  const root = html.indexOf('<div id="root">');
  if (start === -1 || root === -1 || root < start) return "";
  return html.slice(start, root);
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
  it("clips crawlable copy in static CSS and keeps the React mount empty in the file", () => {
    expect(indexHtml).toContain("#bizuply-crawl");
    expect(indexHtml).toContain("clip-path: inset(50%)");
    expect(indexHtml).toContain('<div id="bizuply-crawl"></div>');
    expect(indexHtml).toContain('<div id="root"></div>');
    expect(rootInner(indexHtml)).not.toContain("<h1");
    expect(indexHtml).not.toContain("The official website is bizuply.com");
  });

  it("paints the designed homepage in #root and keeps the GEO summary clipped", async () => {
    const page = await documentFor("https://bizuply.com/", "bizuply.com");
    expect(page.status).toBe(200);
    expect(page.headers.get("x-bizuply-seo-edge")).toBe("marketing");
    expect(page.body).toContain("<title>Bizuply — Run your business. All in one place.</title>");
    expect(page.body).toContain('rel="canonical" href="https://bizuply.com/"');
    expect(page.body).toContain('"@type":"Organization"');
    expect(page.body).toContain('"alternateName":["ביזאפלי","BizUply"]');
    expect(page.body).toContain("<h1>Bizuply</h1>");
    expect(page.body).toContain("The official website is bizuply.com. In Hebrew, the brand name is ביזאפלי.");
    expect(page.body).toContain("clip-path:inset(50%)");
    expect(page.body).toContain('class="home-paint"');
    expect(page.body).toContain("Main navigation");
    expect(page.body).toContain("Run your business");
    expect(page.body).toContain("in one place");
    expect(page.body).toContain("Register now");
    expect(rootInner(page.body)).toContain("home-paint__header");
    expect(rootInner(page.body)).toContain("Run your business");
    expect(rootInner(page.body)).not.toContain("<main lang=\"en\" dir=\"ltr\"><h1>Bizuply</h1>");
    expect(rootInner(page.body)).not.toContain("The official website is bizuply.com");
    expect(rootInner(page.body)).not.toContain("In Hebrew, the brand name");
    const crawl = crawlBlock(page.body);
    expect(crawl).toContain("<h1>Bizuply</h1>");
    expect(crawl).toContain("The official website is bizuply.com");
    expect(crawl).toContain("position:absolute");
    expect(page.body).not.toContain("document.getElementById(\"bizuply-crawl\")");
  });

  it("keeps Hebrew and CRM copy crawlable without placing the raw summary in the React mount", async () => {
    const hebrew = await documentFor("https://bizuply.com/he/", "bizuply.com");
    expect(hebrew.body).toContain('lang="he" dir="rtl"');
    expect(hebrew.body).toContain("נהלו את העסק שלכם");
    expect(hebrew.body).toContain("ביזאפלי");
    expect(rootInner(hebrew.body)).toContain("home-paint__header");
    expect(rootInner(hebrew.body)).not.toContain("<h1>Bizuply</h1>");

    const crm = await documentFor("https://bizuply.com/crm", "bizuply.com");
    expect(crm.body).toContain("<title>CRM Software with Meta Lead Ads Integration | Bizuply</title>");
    expect(crm.body).toContain("<h1>Every lead, every client, every appointment in one place</h1>");
    expect(crm.body).toContain('href="https://bizuply.com/crm"');
    expect(crm.body).toContain('"@type":"BreadcrumbList"');
    expect(rootInner(crm.body)).not.toContain("<h1");
    expect(rootInner(crm.body)).not.toContain("CRM only is $49");
    expect(crawlBlock(crm.body)).toContain("<h2>FAQ</h2>");

    const hebrewCrm = await documentFor("https://bizuply.com/he/crm", "bizuply.com");
    expect(hebrewCrm.body).toContain("<h1>כל ליד, כל לקוח, כל פגישה במקום אחד</h1>");
    expect(hebrewCrm.body).toContain('href="https://bizuply.com/he/crm"');
    expect(rootInner(hebrewCrm.body)).not.toContain("כל ליד");
  });

  it("does not paint the WhatsApp summary inside #root", async () => {
    const page = await documentFor("https://whatsapp.bizuply.com/", "whatsapp.bizuply.com");
    expect(page.status).toBe(200);
    expect(page.headers.get("x-bizuply-seo-edge")).toBe("whatsapp");
    expect(page.body).toContain("<h1>WhatsApp API. Built for Your Business.</h1>");
    expect(page.body).toContain("$29 per month for one connected WhatsApp number");
    expect(rootInner(page.body)).not.toContain("<h1");
    expect(crawlBlock(page.body)).toContain("There is no free trial.");
    expect(page.body).toContain('rel="canonical" href="https://whatsapp.bizuply.com/"');
  });
});
