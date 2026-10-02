import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  path.resolve(process.cwd(), "src/pages/public/WhatsAppApiLanding.tsx"),
  "utf8",
);

describe("WhatsApp API landing copy", () => {
  it("keeps the product claim accurate and the offer explicit", () => {
    expect(source).toContain("Official WhatsApp API access");
    expect(source).toContain("Official Meta-powered onboarding");
    expect(source).toContain("Fast setup with Embedded Signup");
    expect(source).toContain("No unnecessary provider-side delays");
    expect(source).toContain("No third-party bottlenecks");
    expect(source).toContain("Get started quickly with direct onboarding");
    expect(source).toContain("Business verification may be required by Meta");
    expect(source).toContain("Meta conversation and message fees are billed separately");
    expect(source).toContain("$29");
    expect(source).toContain("https://whatsapp.bizuply.com");
    expect(source).toContain("Older BSP workflows");
    expect(source).not.toMatch(/360dialog/i);
  });

  it("does not promise that Meta approval or verification is skipped", () => {
    expect(source).not.toMatch(/no approvals required/i);
    expect(source).not.toMatch(/no business verification ever/i);
    expect(source).not.toMatch(/instant approval/i);
    expect(source).not.toMatch(/approval guaranteed/i);
    expect(source).not.toMatch(/guaranteed approval/i);
    expect(source).not.toMatch(/without meta approval/i);
    expect(source).not.toMatch(/skip business verification/i);
    expect(source).not.toMatch(/no verification needed/i);
    expect(source).not.toMatch(/no verification required/i);
  });
});
