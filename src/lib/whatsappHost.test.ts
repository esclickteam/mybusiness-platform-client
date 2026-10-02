import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  WHATSAPP_SEO_DESCRIPTION,
  WHATSAPP_SEO_KEYWORDS,
  WHATSAPP_SEO_TITLE,
  isBizuplyWhatsAppHost,
  shouldRenderWhatsAppLanding,
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

  it("keeps the public SEO copy used by the landing page", () => {
    expect(WHATSAPP_SEO_TITLE).toBe(
      "Official WhatsApp API Platform for Developers & Businesses | Bizuply",
    );
    expect(WHATSAPP_SEO_DESCRIPTION).toContain("official WhatsApp API");
    expect(WHATSAPP_SEO_DESCRIPTION).toContain("webhooks");
    expect(WHATSAPP_SEO_KEYWORDS).toContain("Embedded Signup");
    expect(WHATSAPP_SEO_KEYWORDS).toContain("WhatsApp API for agencies");
  });

  it("is wired through host routing, SEO, and partner exclusions", () => {
    const root = process.cwd();
    const middleware = readFileSync(path.resolve(root, "middleware.js"), "utf8");
    const app = readFileSync(path.resolve(root, "src/App.jsx"), "utf8");
    const indexHtml = readFileSync(path.resolve(root, "index.html"), "utf8");
    const partnerHost = readFileSync(path.resolve(root, "src/lib/partnerHost.mjs"), "utf8");

    expect(middleware).toContain("isBizuplyWhatsAppHost");
    expect(middleware).toContain("https://whatsapp.bizuply.com/");
    expect(app).toContain("shouldRenderWhatsAppLanding");
    expect(app).toContain("WhatsAppApiLanding");
    expect(indexHtml).toContain("whatsapp.bizuply.com");
    expect(partnerHost).toContain('"whatsapp"');
  });
});
