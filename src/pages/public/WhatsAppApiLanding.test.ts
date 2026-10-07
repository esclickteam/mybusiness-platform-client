import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(process.cwd(), "src/pages/public");

function collect(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return collect(full);
    return /\.(tsx?|css)$/.test(name) && !name.endsWith(".test.ts") ? [full] : [];
  });
}

const files = [path.join(root, "WhatsAppApiLanding.tsx"), ...collect(path.join(root, "whatsapp"))];
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");
const site = files.map((file) => readFileSync(file, "utf8")).join("\n");

describe("WhatsApp API site copy", () => {
  it("leads with the required headline, offer and CTAs", () => {
    const overview = read("whatsapp/pages/OverviewPage.tsx");
    expect(overview).toContain("WhatsApp API.");
    expect(overview).toContain("Built for Your Business.");
    expect(overview).toContain("Connect your CRM, website, SaaS platform or custom system to WhatsApp using API & Webhooks.");
    expect(overview).toContain("Built on Meta's WhatsApp Cloud API");
    expect(overview).toContain('start: "Get Started"');
    expect(overview).toContain("Explore API");
    expect(overview).toContain("Start for $29");
    expect(overview).toContain("/month per number");
    expect(read("whatsapp/siteConfig.tsx")).toMatch(/PRICE_PER_NUMBER_USD\s*=\s*29\b/);
    expect(overview).toContain("Meta messaging fees are billed separately.");
  });

  it("shows the three benefits and the included plan features", () => {
    const overview = read("whatsapp/pages/OverviewPage.tsx");
    for (const text of [
      "Built on Meta's Cloud API",
      "Connect Your Existing Systems",
      "Connect your CRM, website or custom application using our API.",
      "Transparent Pricing",
      "$29/month per number, with Meta messaging fees billed separately.",
      "WhatsApp Cloud API connection",
      "API & Webhooks",
      "Message templates",
      "Management dashboard",
      "Performance analytics",
      "Documentation & OpenAPI",
    ]) {
      expect(overview).toContain(text);
    }
  });

  it("states the pricing terms and the one-number scope", () => {
    const pricing = read("whatsapp/pages/PricingPage.tsx");
    for (const text of [
      "Start for $29",
      "One subscription = one WhatsApp number",
      "Meta messaging fees are separate",
      "No free trial",
      "Taxes may apply where required",
      "Documentation, OpenAPI spec and code samples",
    ]) {
      expect(pricing).toContain(text);
    }
    expect(site).not.toMatch(/wallet|auto[- ]?funding/i);
  });

  it("does not call the integration official", () => {
    expect(site).not.toMatch(/\bofficial\b|הרשמי|\boficial\b|الرسمية/i);
  });

  it("answers the required Help Center questions", () => {
    const help = read("whatsapp/pages/HelpPage.tsx");
    for (const q of [
      "What is the WhatsApp Business API?",
      "Do I need a developer?",
      "Can I use my existing number?",
      "What does $29 include?",
      "What does Meta charge separately?",
      "Can I connect my CRM?",
      "Can I connect my own SaaS product?",
      "How do API keys work?",
      "How do webhooks work?",
      "Can I manage multiple numbers?",
      "Can agencies use Bizuply?",
    ]) {
      expect(help).toContain(q);
    }
  });

  it("labels the hero simulation as sample data and only shows status webhooks", () => {
    const sim = read("whatsapp/HeroSimulation.tsx");
    expect(sim).toContain("Illustration · sample data");
    expect(sim).toMatch(/whatsapp\.message\.\$\{status\}/);
    expect(sim).not.toMatch(/inbound|incoming|message\.received|customer repl/i);
  });

  it("routes every page in the primary navigation", () => {
    const shell = read("WhatsAppApiLanding.tsx");
    for (const route of ["/developers", "/agencies", "/pricing", "/docs", "/help", "/get-started", "/security"]) {
      expect(shell).toContain(`case "${route}"`);
    }
    const chrome = read("whatsapp/SiteChrome.tsx");
    for (const label of ["Overview", "Developers", "Agencies", "Pricing", "Documentation", "Help Center", "Log in", "Get Started"]) {
      expect(chrome).toContain(`"${label}"`);
    }
  });

  it("renders the translated get-started page in the visitor's language and direction, not as English LTR", () => {
    const shell = read("WhatsAppApiLanding.tsx");
    const localized = shell.match(/const LOCALIZED_PATHS = new Set\(\[([^\]]*)\]\)/)?.[1] ?? "";
    expect(localized).toContain('"/get-started"');
    expect(shell).toMatch(/LOCALIZED_PATHS\.has\(path\) \? page : <div \{\.\.\.englishOnly\(lang\)\}>/);
  });

  it("labels the interactive flow as an illustration, not a live transaction", () => {
    expect(read("whatsapp/ApiFlowDemo.tsx")).toMatch(/not a live API transaction/i);
  });

  it("documents only endpoints that exist in the OpenAPI spec", () => {
    const docs = read("whatsapp/pages/DocsPage.tsx") + read("whatsapp/apiSamples.ts");
    expect(read("whatsapp/siteConfig.tsx")).toContain("/api/v1/whatsapp");
    expect(docs).toContain("/templates");
    expect(docs).toContain("/messages/template");
    expect(docs).toContain("/messages/");
    expect(docs).toContain("Idempotency-Key");
    expect(docs).toContain("X-Bizuply-Signature");
    expect(site).not.toMatch(/sandbox\.bizuply|api\/v2\//i);
  });

  it("makes no unverified partner, certification or uptime claims", () => {
    expect(site).not.toMatch(/meta business partner/i);
    expect(site).not.toMatch(/official meta partner/i);
    expect(site).not.toMatch(/SOC ?2 (type|certified|compliant)/i);
    expect(site).not.toMatch(/ISO ?27001 certified/i);
    expect(site).not.toMatch(/HIPAA compliant/i);
    expect(site).not.toMatch(/99\.9+% uptime/i);
    expect(site).not.toMatch(/360dialog/i);
  });

  it("does not display third-party integration logos", () => {
    expect(site).not.toMatch(/(zapier|hubspot|salesforce|wordpress)[\w-]*\.(svg|png|webp)/i);
  });

  it("does not promise that Meta approval or verification is skipped", () => {
    expect(site).not.toMatch(/no approvals required/i);
    expect(site).not.toMatch(/no business verification ever/i);
    expect(site).not.toMatch(/(?<!no )instant approval/i);
    expect(site).not.toMatch(/approval guaranteed/i);
    expect(site).not.toMatch(/guaranteed approval/i);
    expect(site).not.toMatch(/without meta approval/i);
    expect(site).not.toMatch(/skip business verification/i);
    expect(site).not.toMatch(/no verification needed/i);
    expect(site).not.toMatch(/no verification required/i);
  });
});
