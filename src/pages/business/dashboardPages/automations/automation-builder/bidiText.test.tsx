import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MixedBidiText } from "./bidiText";

describe("MixedBidiText", () => {
  it("isolates Latin acronyms inside Hebrew labels", () => {
    const { container } = render(<MixedBidiText text="ליד חדש ב־CRM" />);
    const ltr = container.querySelectorAll("bdi[dir='ltr']");
    expect(ltr.length).toBeGreaterThanOrEqual(1);
    expect(Array.from(ltr).some((el) => el.textContent === "CRM")).toBe(true);
    expect(container.textContent).toContain("ליד חדש");
    expect(container.textContent).toContain("CRM");
  });

  it("isolates multi-word Latin brands", () => {
    const { container } = render(
      <MixedBidiText text="שליחת WhatsApp דרך Webhook ל-Stripe" />
    );
    const texts = Array.from(container.querySelectorAll("bdi[dir='ltr']")).map(
      (el) => el.textContent
    );
    expect(texts).toEqual(
      expect.arrayContaining(["WhatsApp", "Webhook", "Stripe"])
    );
  });

  it("keeps pure Hebrew without LTR isolates", () => {
    const { container } = render(<MixedBidiText text="שינוי סטטוס ליד" />);
    expect(container.querySelectorAll("bdi[dir='ltr']").length).toBe(0);
    expect(container.textContent).toBe("שינוי סטטוס ליד");
  });
});