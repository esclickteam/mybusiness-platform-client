import { afterEach, describe, expect, it } from "vitest";
import {
  clearGuidedDemoLocal,
  isGuidedDemoActive,
  readGuidedDemoLocaleLock,
  readGuidedDemoSession,
  writeGuidedDemoSession,
} from "./sessionStore";

afterEach(() => {
  clearGuidedDemoLocal();
  sessionStorage.clear();
});

describe("guided demo session store", () => {
  it("is inactive until a session is written", () => {
    expect(isGuidedDemoActive()).toBe(false);
    expect(readGuidedDemoSession()).toBeNull();
  });

  it("persists progress so reload can resume", () => {
    writeGuidedDemoSession({
      currentStepId: "crm-status-contacted",
      currentStepIndex: 3,
      completedStepIds: ["crm-intro", "crm-open-leads", "crm-open-daniel"],
    });
    expect(isGuidedDemoActive()).toBe(true);
    expect(readGuidedDemoSession().currentStepId).toBe("crm-status-contacted");
    expect(readGuidedDemoSession().completedStepIds).toHaveLength(3);
  });

  it("keeps the redeem locale when later payloads for the same invitation disagree", () => {
    writeGuidedDemoSession({ invitationId: "inv1", locale: "en" });
    writeGuidedDemoSession({ invitationId: "inv1", locale: "he", currentStepIndex: 4 });
    writeGuidedDemoSession({ invitationId: "inv1", locale: null, currentStepIndex: 5 });
    expect(readGuidedDemoLocaleLock()).toBe("en");
    expect(readGuidedDemoSession().locale).toBe("en");
    expect(readGuidedDemoSession().currentStepIndex).toBe(5);
  });

  it("takes the new locale when a different invitation is redeemed", () => {
    writeGuidedDemoSession({ invitationId: "inv1", locale: "en" });
    writeGuidedDemoSession({ invitationId: "inv2", locale: "ar" });
    expect(readGuidedDemoLocaleLock()).toBe("ar");
  });
});
