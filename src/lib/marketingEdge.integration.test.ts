import { describe, expect, it } from "vitest";
import middleware from "../../middleware.js";

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
  it("serves robots and sitemap for the marketing host", async () => {
    const robots = await read(await middleware(request("https://bizuply.com/robots.txt", "bizuply.com", "*/*")));
    const sitemap = await read(await middleware(request("https://bizuply.com/sitemap.xml", "bizuply.com", "*/*")));
    expect(robots.status).toBe(200);
    expect(robots.body).toContain("User-agent: *\nAllow: /");
    expect(robots.body).toContain("Sitemap: https://bizuply.com/sitemap.xml");
    expect(robots.body).not.toMatch(/^Disallow: \/$/m);
    expect(sitemap.status).toBe(200);
    expect(sitemap.body).toContain("<loc>https://bizuply.com/</loc>");
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
    expect(page.body).toContain("<title>Bizuply — Everything your business needs to grow, in one place</title>");
    expect(page.body).toContain('rel="canonical" href="https://bizuply.com/"');
    expect(page.body).toContain('"name":"Bizuply"');
    expect(page.body).toContain('"alternateName":["ביזאפלי","BizUply"]');
    expect(page.body).toContain("<h1>Bizuply</h1>");
    expect(page.body).not.toContain("noindex");
  });

  it("gives product pages their own metadata and keeps dynamic routes untouched", async () => {
    const crm = await read(await middleware(request("https://bizuply.com/crm", "bizuply.com")));
    const booking = await middleware(request("https://bizuply.com/book/example-business", "bizuply.com"));
    const login = await read(await middleware(request("https://bizuply.com/login", "bizuply.com")));
    expect(crm.status).toBe(200);
    expect(crm.body).toContain("<title>CRM Software with Meta Lead Ads Integration | Bizuply</title>");
    expect(crm.body).toContain('href="https://bizuply.com/crm"');
    expect(crm.body).toContain('"@type":"BreadcrumbList"');
    const hebrewCrm = await read(await middleware(request("https://bizuply.com/he/crm", "bizuply.com")));
    expect(hebrewCrm.status).toBe(200);
    expect(hebrewCrm.body).toContain('lang="he" dir="rtl"');
    expect(hebrewCrm.body).toContain("<h1>כל ליד, כל לקוח, כל פגישה במקום אחד</h1>");
    expect(hebrewCrm.body).toContain('href="https://bizuply.com/he/crm"');
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

  it("does not apply marketing metadata to a customer site", async () => {
    const customer = await read(
      await middleware(request("https://idoeshet.sites.bizuply.com/", "idoeshet.sites.bizuply.com")),
    );
    expect(customer.status).not.toBe(404);
    expect(customer.body).not.toContain("CRM Software with Meta Lead Ads Integration");
    expect(customer.body).not.toContain('href="https://bizuply.com/crm"');
    expect(customer.headers.get("x-bizuply-seo-edge")).not.toBe("marketing");
  });
});
