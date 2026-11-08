import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import middleware from "../../middleware.js";

const marketingHtml = readFileSync(path.resolve(process.cwd(), "marketing.html"), "utf8");
const indexHtml = readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
const homeCriticalCss = readFileSync(path.resolve(process.cwd(), "public/home-critical.css"), "utf8");
const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubShellFetch() {
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
}

function request(url: string, host: string, accept = "text/html") {
  return new Request(url, {
    headers: {
      accept,
      "x-forwarded-host": host,
    },
  });
}

async function read(response: Response) {
  return {
    status: response.status,
    headers: response.headers,
    body: await response.text(),
  };
}

describe("marketing edge integration", () => {
  beforeEach(() => {
    stubShellFetch();
  });

  it("serves robots and sitemap for the marketing host", async () => {
    const robots = await read(await middleware(request("https://bizuply.com/robots.txt", "bizuply.com", "*/*")));
    const sitemap = await read(await middleware(request("https://bizuply.com/sitemap.xml", "bizuply.com", "*/*")));
    expect(robots.status).toBe(200);
    expect(robots.body).toContain("User-agent: *\nAllow: /");
    expect(robots.body).toContain("Sitemap: https://bizuply.com/sitemap.xml");
    expect(robots.body).not.toMatch(/^Disallow: \/$/m);
    expect(sitemap.status).toBe(200);
    expect(sitemap.body).toContain("<loc>https://bizuply.com/</loc>");
    expect(sitemap.body).toContain("<loc>https://bizuply.com/he</loc>");
    expect(sitemap.body).not.toContain("<loc>https://bizuply.com/he/</loc>");
    expect(sitemap.body).toContain("<loc>https://bizuply.com/crm</loc>");
    expect(sitemap.body).not.toContain("/saas");
  });

  it("serves the WhatsApp and Travel discovery files", async () => {
    const whatsapp = await read(
      await middleware(request("https://whatsapp.bizuply.com/sitemap.xml", "whatsapp.bizuply.com", "*/*")),
    );
    const travel = await read(
      await middleware(request("https://travel.bizuply.com/robots.txt", "travel.bizuply.com", "*/*")),
    );
    expect(whatsapp.status).toBe(200);
    expect(whatsapp.body).toContain("https://whatsapp.bizuply.com/pricing");
    expect(travel.status).toBe(200);
    expect(travel.body).toContain("Sitemap: https://travel.bizuply.com/sitemap.xml");
  });

  it("puts a unique title, canonical, brand name and H1 on the homepage HTML", async () => {
    const page = await read(await middleware(request("https://bizuply.com/", "bizuply.com")));
    expect(page.status).toBe(200);
    expect(page.headers.get("x-bizuply-seo-edge")).toBe("marketing");
    expect(page.body).toContain("<title>BizUply | CRM, lead management, WhatsApp Business API and business tools</title>");
    expect(page.body).toContain('rel="canonical" href="https://bizuply.com/"');
    expect(page.body).toContain('"name":"Bizuply LLC"');
    expect(page.body).toContain('"name":"BizUply"');
    expect(page.body).toContain('"alternateName":["BizUply","Bizuply","ביזאפלי"]');
    expect(page.body).toContain('class="hx-hero"');
    expect(page.body).toContain('data-home-design="purple"');
    expect(page.body).toContain(">Your</span>");
    expect(page.body).toContain(">possibilities.</span>");
    expect(page.body).not.toContain('class="home-hero"');
    expect(page.body).not.toContain("home-hero__title");
    expect(page.body).toContain('class="bizuply-home hx-preview"');
    expect(page.body.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "").match(/<h1\b/gi)?.length).toBe(1);
    expect(page.headers.get("x-robots-tag")).toBeNull();
    const withoutScripts = page.body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    expect(withoutScripts).toContain('<meta name="robots" content="index, follow" />');
    expect(withoutScripts).not.toContain("noindex");
    expect(page.body).toContain('robots.content = "noindex, nofollow"');
  });

  it("gives product pages their own metadata and keeps dynamic routes untouched", async () => {
    const crm = await read(await middleware(request("https://bizuply.com/crm", "bizuply.com")));
    const booking = await middleware(request("https://bizuply.com/book/example-business", "bizuply.com"));
    const login = await read(await middleware(request("https://bizuply.com/login", "bizuply.com")));
    expect(crm.status).toBe(200);
    expect(crm.body).toContain("<title>CRM for leads and customers | BizUply</title>");
    expect(crm.body).toContain('href="https://bizuply.com/crm"');
    expect(crm.body).toContain('"@type":"BreadcrumbList"');
    const hebrewCrm = await read(await middleware(request("https://bizuply.com/he/crm", "bizuply.com")));
    expect(hebrewCrm.status).toBe(200);
    expect(hebrewCrm.body).toContain('lang="he" dir="rtl"');
    expect(hebrewCrm.body).toContain("<h1>מערכת CRM שמחברת בין הלידים, הלקוחות והעבודה היומיומית</h1>");
    expect(hebrewCrm.body).toContain('href="https://bizuply.com/he/crm"');
    expect(hebrewCrm.body).toContain('alt="ביזאפלי (BizUply)"');
    const hebrewHome = await read(await middleware(request("https://bizuply.com/he", "bizuply.com")));
    expect(hebrewHome.body).toContain('rel="canonical" href="https://bizuply.com/he"');
    const whatsappHebrew = await read(await middleware(request("https://bizuply.com/he/whatsapp-api", "bizuply.com")));
    expect(whatsappHebrew.body).toContain("29 דולר");
    const whatsappEnglish = await middleware(request("https://bizuply.com/whatsapp-api", "bizuply.com"));
    expect(whatsappEnglish.status).toBe(301);
    expect(whatsappEnglish.headers.get("location")).toBe("https://whatsapp.bizuply.com/");
    expect(booking.headers.get("x-middleware-next")).toBe("1");
    expect(login.status).toBe(200);
    expect(login.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("returns real 404s and 301s without exposing private routes", async () => {
    const missing = await read(
      await middleware(request("https://bizuply.com/this-page-does-not-exist-xyz", "bizuply.com")),
    );
    const join = await middleware(request("https://bizuply.com/join", "bizuply.com"));
    const pricing = await middleware(request("https://bizuply.com/Pricing", "bizuply.com"));
    expect(missing.status).toBe(404);
    expect(missing.body).toContain("Page not found");
    expect(missing.body).toContain("noindex");
    expect(missing.body).not.toContain("dashboard");
    expect(join.status).toBe(301);
    expect(join.headers.get("location")).toBe("https://bizuply.com/business");
    expect(pricing.status).toBe(301);
    expect(pricing.headers.get("location")).toBe("https://bizuply.com/pricing");
  });

  it("marks a search URL with a query as noindex and leaves the bare search page indexed", async () => {
    stubShellFetch();
    const bare = await read(await middleware(request("https://bizuply.com/search", "bizuply.com")));
    const queried = await read(await middleware(request("https://bizuply.com/he/search?name=zzzz", "bizuply.com")));
    const bareHead = bare.body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const queriedHead = queried.body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    expect(bareHead).toContain('<meta name="robots" content="index, follow" />');
    expect(bare.headers.get("x-robots-tag")).toBeNull();
    expect(queriedHead).toContain('<meta name="robots" content="noindex, follow" />');
    expect(queriedHead).not.toContain('<meta name="robots" content="index, follow" />');
    expect(queried.headers.get("x-robots-tag")).toBe("noindex, follow");
  });

  it("does not apply marketing metadata to a customer site", async () => {
    const customer = await read(
      await middleware(request("https://idoeshet.sites.bizuply.com/", "idoeshet.sites.bizuply.com")),
    );
    expect(customer.status).not.toBe(404);
    expect(customer.body).not.toContain("CRM Software for Small Businesses");
    expect(customer.body).not.toContain('href="https://bizuply.com/crm"');
    expect(customer.headers.get("x-bizuply-seo-edge")).not.toBe("marketing");
  });
});
