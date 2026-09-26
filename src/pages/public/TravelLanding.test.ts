import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  path.resolve(process.cwd(), "src/pages/public/TravelLanding.tsx"),
  "utf8",
);

describe("Bizuply Travel landing copy", () => {
  it("states the company, product, and partnership request without invented credentials", () => {
    expect(source).toContain(
      "Travel Technology Infrastructure for Modern Travel Businesses",
    );
    expect(source).toContain("Built by Bizuply LLC");
    expect(source).toContain(
      "Currently expanding our API and distribution partnerships.",
    );
    expect(source).toContain("support@bizuply.com");
    expect(source).toContain("Partnership & API Inquiries");
    expect(source).not.toMatch(/IATA|Amadeus|Expedia|Duffel|Ticketmaster/i);
    expect(source).not.toMatch(/\bARC\b|\bGDS\b|accredit/i);
  });
});
