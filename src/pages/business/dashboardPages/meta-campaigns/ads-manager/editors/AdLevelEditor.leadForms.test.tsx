import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdLevelEditor from "./AdLevelEditor";
import { createDefaultAd } from "../adsManagerDefaults";
import type { InstantFormItem } from "../adsManagerTypes";

const duplicateMetaLeadForm = vi.fn();
const setMetaLeadFormStatus = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: () => undefined },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (key.endsWith("duplicateForm")) return "Duplicate";
      if (key.endsWith("archiveForm")) return "Archive";
      if (key.endsWith("restoreForm")) return "Restore";
      if (key.endsWith("archiveFormConfirm")) return `Archive ${opts?.name}`;
      if (key.endsWith("duplicateFormDone")) return "copied";
      if (key.endsWith("archiveFormDone")) return "archived";
      if (key.endsWith("formTabActive")) return "Active";
      if (key.endsWith("formTabArchived")) return "Archived";
      if (key.endsWith("createdOn")) return `Created ${opts?.date || ""}`;
      if (key.endsWith("customQuestionsCount")) return `${opts?.count} custom`;
      return key;
    },
    i18n: { language: "en" },
  }),
}));

vi.mock("../../../../../../api/metaCampaignsApi", () => ({
  duplicateMetaLeadForm: (...args: unknown[]) => duplicateMetaLeadForm(...args),
  setMetaLeadFormStatus: (...args: unknown[]) => setMetaLeadFormStatus(...args),
  uploadMetaMedia: vi.fn(),
}));

const liveForm: InstantFormItem = {
  id: "form_live",
  name: "טופס לידים",
  status: "active",
  customQuestions: 3,
  updatedAt: "2026-10-18",
};

describe("instant form duplicate and archive", () => {
  beforeEach(() => {
    duplicateMetaLeadForm.mockReset();
    setMetaLeadFormStatus.mockReset();
    duplicateMetaLeadForm.mockResolvedValue({ form: { id: "form_copy" } });
    setMetaLeadFormStatus.mockResolvedValue({ form: { id: "form_live", status: "ARCHIVED" } });
  });

  it("duplicates a form without selecting the copy on the ad", async () => {
    const onChange = vi.fn();
    const onFormsRefresh = vi.fn().mockResolvedValue(undefined);
    const ad = {
      ...createDefaultAd("Leads"),
      facebookPageId: "page_1",
      instantFormId: "form_live",
      formTab: "active" as const,
    };
    render(
      <AdLevelEditor
        ad={ad}
        forms={[liveForm]}
        pages={[]}
        businessId="biz"
        onChange={onChange}
        onFormsRefresh={onFormsRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("lead-form-duplicate-form_live"));

    await waitFor(() => expect(duplicateMetaLeadForm).toHaveBeenCalledTimes(1));
    const payload = duplicateMetaLeadForm.mock.calls[0][1];
    expect(payload.confirmDuplicate).toBe(true);
    expect(payload.sourceFormId).toBe("form_live");
    expect(payload.pageId).toBe("page_1");
    expect(payload.publishId).toBeUndefined();
    expect(onChange).not.toHaveBeenCalled();
    expect(onFormsRefresh).toHaveBeenCalled();
  });

  it("archives only the form status and keeps the ad selection", async () => {
    const onChange = vi.fn();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    const ad = {
      ...createDefaultAd("Leads"),
      facebookPageId: "page_1",
      instantFormId: "form_live",
      formTab: "active" as const,
    };
    render(
      <AdLevelEditor
        ad={ad}
        forms={[liveForm]}
        pages={[]}
        businessId="biz"
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId("lead-form-archive-form_live"));

    await waitFor(() => expect(setMetaLeadFormStatus).toHaveBeenCalledTimes(1));
    expect(confirm).toHaveBeenCalledWith("Archive טופס לידים");
    const payload = setMetaLeadFormStatus.mock.calls[0][1];
    expect(payload).toMatchObject({
      formId: "form_live",
      status: "ARCHIVED",
      confirmStatus: true,
      pageId: "page_1",
    });
    expect(payload.publishId).toBeUndefined();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ formTab: "archived" });
    confirm.mockRestore();
  });
});
