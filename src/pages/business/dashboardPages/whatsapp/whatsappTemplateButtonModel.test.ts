import { describe, expect, it } from "vitest";
import {
  analyzeUrlButton,
  applyUrlTypeChange,
  buttonSetIssues,
} from "./whatsappTemplateButtonModel";
import type { WhatsAppTemplateButton } from "@/api/whatsappApi";

const TEMPLATE = "https://evently360.com/invite/{{1}}";
const SAMPLE = "https://evently360.com/invite/cmuq3dhv00004116n61fnzzqs";
const TOKEN = "cmuq3dhv00004116n61fnzzqs";

const inviteButton = (): WhatsAppTemplateButton => ({
  type: "url",
  text: "אישור הגעה",
  url: TEMPLATE,
  urlType: "dynamic",
  exampleUrl: SAMPLE,
});

describe("whatsapp template URL buttons", () => {
  it("accepts a full sample URL and exposes only the token as the send value", () => {
    const analyzed = analyzeUrlButton(inviteButton());
    expect(analyzed.issues).toEqual([]);
    expect(analyzed.exampleUrl).toBe(SAMPLE);
    expect(analyzed.previewUrl).toBe(SAMPLE);
    expect(analyzed.suffix).toBe(TOKEN);
    expect(analyzed.suffix.startsWith("https://")).toBe(false);
  });

  it("does not turn a token into an https URL", () => {
    const analyzed = analyzeUrlButton({
      ...inviteButton(),
      exampleUrl: TOKEN,
    });
    expect(analyzed.exampleUrl).toBe(TOKEN);
    expect(analyzed.issues).toContain("SAMPLE_MUST_BE_FULL_URL");
    expect(analyzed.previewUrl).toBe("");
  });

  it("rejects https://token because it does not match the base URL", () => {
    const analyzed = analyzeUrlButton({
      ...inviteButton(),
      exampleUrl: `https://${TOKEN}`,
    });
    expect(analyzed.issues).toContain("SAMPLE_MISMATCH");
  });

  it("adds {{1}} when switching a static site to dynamic", () => {
    const next = applyUrlTypeChange(
      { type: "url", text: "אישור הגעה", url: "https://evently360.com/invite", urlType: "static" },
      "dynamic"
    );
    expect(next.url).toBe(TEMPLATE);
    expect(next.urlType).toBe("dynamic");
  });

  it("keeps quick replies valid and blocks a split button order", () => {
    expect(
      buttonSetIssues([{ type: "quick_reply", text: "מגיע" }, inviteButton()])
    ).toEqual([]);
    expect(
      buttonSetIssues([
        { type: "quick_reply", text: "א" },
        { type: "url", text: "אתר", url: "https://evently360.com", urlType: "static" },
        { type: "quick_reply", text: "ב" },
      ])
    ).toContain("BUTTON_ORDER");
  });
});
