import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  path.resolve(process.cwd(), "src/pages/public/TravelLanding.tsx"),
  "utf8",
);

describe("Bizuply Travel landing copy", () => {
  it("presents the product and partnership request without invented credentials", () => {
    expect(source).toContain("One Platform. Every Travel Experience.");
    expect(source).toContain("Currently expanding our global API partner network");
    expect(source).toContain("API & Partnership Inquiries");
    expect(source).toContain("Become a Partner");
    expect(source).toContain("support@bizuply.com");
    expect(source).toContain("Bizuply LLC");
    expect(source).not.toMatch(/IATA|Amadeus|Expedia|Duffel|Ticketmaster|Travelport|CarTrawler/i);
    expect(source).not.toMatch(/\bARC\b|\bGDS\b|accredit/i);
  });
});
