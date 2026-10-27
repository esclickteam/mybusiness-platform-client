import { describe, expect, it } from "vitest";
import { documentShellForHost } from "../../middleware.js";

describe("marketing document shell", () => {
  it("uses the marketing entry only for the public homepage", () => {
    expect(documentShellForHost("bizuply.com", "/")).toBe("marketing");
    expect(documentShellForHost("www.bizuply.com", "/he")).toBe("marketing");
    expect(documentShellForHost("www.bizuply.com", "/he/")).toBe("marketing");
    expect(documentShellForHost("bizuply.com", "/es")).toBe("marketing");
    expect(documentShellForHost("bizuply.com", "/pt-br")).toBe("marketing");
    expect(documentShellForHost("bizuply.com", "/ar")).toBe("marketing");
    expect(documentShellForHost("bizuply-marketing-preview.vercel.app", "/")).toBe("marketing");
  });

  it("keeps every other marketing path on the application entry", () => {
    for (const path of ["/login", "/register", "/pricing", "/crm", "/he/crm", "/dashboard", "/business/abc"]) {
      expect(documentShellForHost("bizuply.com", path)).toBe("index");
    }
  });

  it("never selects the marketing entry for customer, WhatsApp, Travel, or SaaS hosts", () => {
    const hosts = [
      "idoeshet.sites.bizuply.com",
      "customer.example.com",
      "whatsapp.bizuply.com",
      "www.whatsapp.bizuply.com",
      "travel.bizuply.com",
      "www.travel.bizuply.com",
    ];
    for (const host of hosts) {
      expect(documentShellForHost(host, "/")).toBe("index");
      expect(documentShellForHost(host, "/he")).toBe("index");
      expect(documentShellForHost(host, "/login")).toBe("index");
    }
  });
});
