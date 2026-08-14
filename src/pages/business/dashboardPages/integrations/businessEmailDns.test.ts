import { buildDomainManagerInstructions, senderDisplayName } from "./businessEmailDns";

describe("business email DNS helpers", () => {
  test("builds copyable instructions with real records", () => {
    const text = buildDomainManagerInstructions({
      domain: "invistimo.com",
      email: "support@invistimo.com",
      displayName: "Invistimo",
      records: [
        { type: "TXT", name: "resend._domainkey", value: "p=abc" },
        { type: "MX", name: "send", value: "feedback-smtp.resend.com", priority: "10" },
      ],
    });
    expect(text).toContain("Bizuply");
    expect(text).toContain("invistimo.com");
    expect(text).toContain("support@invistimo.com");
    expect(text).toContain("TXT");
    expect(text).toContain("resend._domainkey");
    expect(text).toContain("p=abc");
    expect(text).toContain("עדיפות: 10");
  });

  test("strips raw header characters from the card name", () => {
    expect(senderDisplayName({ displayName: "<Invistimo", email: "support@invistimo.com" })).toBe(
      "Invistimo"
    );
  });
});
