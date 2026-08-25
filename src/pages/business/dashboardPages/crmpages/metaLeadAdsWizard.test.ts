import { describe, expect, it } from "vitest";
import {
  canNavigateToMetaLeadWizardStep,
  deriveMetaLeadWizardStep,
  isMetaLeadSetupComplete,
} from "./metaLeadAdsWizard";

const completeSnapshot = {
  metaAccountConnected: true,
  connectedPageId: "page-1",
  selectedLeadFormId: "form-1",
};

describe("deriveMetaLeadWizardStep", () => {
  it("stays on step 1 until the Meta account is connected", () => {
    expect(
      deriveMetaLeadWizardStep({
        metaAccountConnected: false,
        connectedPageId: "",
        selectedLeadFormId: "",
      })
    ).toBe(1);
  });

  it("stays on step 2 when the account is connected but page or form is missing", () => {
    expect(
      deriveMetaLeadWizardStep({
        metaAccountConnected: true,
        connectedPageId: "page-1",
        selectedLeadFormId: "",
      })
    ).toBe(2);
    expect(
      deriveMetaLeadWizardStep({
        metaAccountConnected: true,
        pagesCount: 2,
        connectedPageId: "",
        selectedLeadFormId: "form-1",
      })
    ).toBe(2);
  });

  it("goes to step 3 when account, page, and form are persisted", () => {
    expect(deriveMetaLeadWizardStep(completeSnapshot)).toBe(3);
  });

  it("lets the stepper reopen step 1 or 2 after completion", () => {
    expect(
      deriveMetaLeadWizardStep(completeSnapshot, { viewingStep: 1 })
    ).toBe(1);
    expect(
      deriveMetaLeadWizardStep(completeSnapshot, { viewingStep: 2 })
    ).toBe(2);
    expect(
      deriveMetaLeadWizardStep(completeSnapshot, { viewingStep: 3 })
    ).toBe(3);
  });

  it("allows an explicit change-setup view, but reload without that flag stays on step 3", () => {
    const snapshot = {
      metaAccountConnected: true,
      connectedPage: { pageId: "page-1" },
      selectedForm: { formId: "form-1" },
    };
    expect(deriveMetaLeadWizardStep(snapshot, { editingSetup: true })).toBe(2);
    expect(deriveMetaLeadWizardStep(snapshot)).toBe(3);
  });

  it("treats a reload snapshot with only backend fields as complete", () => {
    const snapshot = {
      metaAccountConnected: true,
      connectedPageId: "3513934265432172-page",
      selectedLeadFormId: "3513934265432172",
    };
    expect(isMetaLeadSetupComplete(snapshot)).toBe(true);
    expect(deriveMetaLeadWizardStep(snapshot)).toBe(3);
  });

  it("does not open step 2 or 3 before those prerequisites exist", () => {
    const accountOnly = {
      metaAccountConnected: true,
      connectedPageId: "",
      selectedLeadFormId: "",
    };
    expect(canNavigateToMetaLeadWizardStep(accountOnly, 2)).toBe(true);
    expect(canNavigateToMetaLeadWizardStep(accountOnly, 3)).toBe(false);
    expect(deriveMetaLeadWizardStep(accountOnly, { viewingStep: 3 })).toBe(2);

    const empty = {
      metaAccountConnected: false,
      connectedPageId: "",
      selectedLeadFormId: "",
    };
    expect(canNavigateToMetaLeadWizardStep(empty, 2)).toBe(false);
    expect(deriveMetaLeadWizardStep(empty, { viewingStep: 2 })).toBe(1);
  });
});
