import { describe, expect, it } from "vitest";
import { metaAdsFriendlyMessage } from "./metaAdsFriendlyError";
import { AUTOMATION_TEMPLATES } from "./metaAutomationTemplates";

describe("Phase 9 UX helpers", () => {
  it("maps Graph rate limits and token errors to safe codes", () => {
    expect(metaAdsFriendlyMessage({ response: { status: 429 } }, "LOAD")).toBe("RATE_LIMIT");
    expect(metaAdsFriendlyMessage({ message: "(#190) session has expired" }, "LOAD")).toBe("TOKEN");
    expect(metaAdsFriendlyMessage({ response: { status: 403, data: { error: "permission" } } }, "LOAD")).toBe(
      "PERMISSION"
    );
  });

  it("keeps automation templates on the existing rule engine fields", () => {
    expect(AUTOMATION_TEMPLATES).toHaveLength(4);
    expect(AUTOMATION_TEMPLATES.every((row) => row.payload.mode === "RECOMMEND")).toBe(true);
    expect(AUTOMATION_TEMPLATES.some((row) => row.payload.action === "PAUSE_AD")).toBe(true);
  });
});
