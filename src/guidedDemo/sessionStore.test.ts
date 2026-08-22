import { afterEach, describe, expect, it } from "vitest";
import {
  clearGuidedDemoLocal,
  isGuidedDemoActive,
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
});
