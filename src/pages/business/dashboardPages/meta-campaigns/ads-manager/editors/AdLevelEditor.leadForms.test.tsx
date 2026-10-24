import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdLevelEditor from "./AdLevelEditor";
import { createDefaultAd } from "../adsManagerDefaults";
import type { InstantFormItem } from "../adsManagerTypes";

const duplicateMetaLeadForm = vi.fn();
const setMetaLeadFormStatus = vi.fn();
const createMetaLeadForm = vi.fn();
const saveMetaLeadFormDraft = vi.fn();

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
  createMetaLeadForm: (...args: unknown[]) => createMetaLeadForm(...args),
  saveMetaLeadFormDraft: (...args: unknown[]) => saveMetaLeadFormDraft(...args),
  syncMetaLeadForm: vi.fn(),
  uploadMetaMedia: vi.fn(),
  listPageWhatsAppNumbers: vi.fn().mockResolvedValue({ numbers: [] }),
  inspectPageWhatsAppNumber: vi.fn(),
  requestPageWhatsAppCode: vi.fn(),
  verifyPageWhatsAppCode: vi.fn(),
}));

const liveForm: InstantFormItem = {
  id: "form_live",
  name: "טופס לידים",
  status: "active",
  customQuestions: 1,
  updatedAt: "2026-10-18",
  locale: "he_IL",
  privacyPolicyUrl: "https://evently360.com/privacy-policy",
  questions: [
    { type: "FULL_NAME", key: "full_name" },
    { type: "PHONE", key: "phone" },
    { type: "CUSTOM", key: "interest", label: "במה אתם מתעניינים?" },
  ],
  contextCard: { title: "כותרת מקור", content: "תיאור מקור" },
  thankYouPage: {
    title: "תודה",
    body: "הפרטים התקבלו",
    buttonText: "בואו להכיר את Evently360",
    buttonType: "VIEW_WEBSITE",
    websiteUrl: "https://evently360.com/",
  },
  followUpActionUrl: "",
};

describe("instant form duplicate and archive", () => {
  beforeEach(() => {
    duplicateMetaLeadForm.mockReset();
    setMetaLeadFormStatus.mockReset();
    createMetaLeadForm.mockReset();
    saveMetaLeadFormDraft.mockReset();
    duplicateMetaLeadForm.mockResolvedValue({ form: { id: "form_copy" } });
    setMetaLeadFormStatus.mockResolvedValue({ form: { id: "form_live", status: "ARCHIVED" } });
    saveMetaLeadFormDraft.mockResolvedValue({ success: true, savedOnMeta: false });
    createMetaLeadForm.mockResolvedValue({
      success: true,
      confirmedByMeta: true,
      savedLocally: true,
      form: { id: "form_copy", name: "עותק ערוך", pageId: "page_1" },
    });
  });

  it("opens a prefilled duplicate editor and creates a form only after confirmation", async () => {
    const onChange = vi.fn();
    const onFormReady = vi.fn();
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
        publishId="pub_1"
        onChange={onChange}
        onFormReady={onFormReady}
        onFormsRefresh={onFormsRefresh}
      />
    );

    fireEvent.click(screen.getByTestId("lead-form-duplicate-form_live"));

    expect(duplicateMetaLeadForm).not.toHaveBeenCalled();
    const name = await screen.findByTestId("lead-form-name");
    expect(name).toHaveValue("טופס לידים - עותק");
    fireEvent.change(name, { target: { value: "עותק ערוך" } });
    fireEvent.click(screen.getByTestId("lead-form-step-intro"));
    fireEvent.change(screen.getByTestId("lead-form-intro-title"), {
      target: { value: "כותרת חדשה" },
    });
    fireEvent.click(screen.getByTestId("lead-form-step-ending"));
    const url = screen.getByTestId("lead-form-thank-you-url");
    expect(url).toHaveValue("https://evently360.com/");
    fireEvent.change(url, { target: { value: "https://evently360.com/new" } });

    fireEvent.click(screen.getByTestId("save-lead-form-draft"));
    await waitFor(() => expect(saveMetaLeadFormDraft).toHaveBeenCalledTimes(1));
    expect(createMetaLeadForm).not.toHaveBeenCalled();
    expect(duplicateMetaLeadForm).not.toHaveBeenCalled();
    const draft = saveMetaLeadFormDraft.mock.calls[0][1] as {
      sourceFormId: string;
      editor: { name: string; introTitle: string; thankYouLink: string };
    };
    expect(draft.sourceFormId).toBe("form_live");
    expect(draft.editor.name).toBe("עותק ערוך");
    expect(draft.editor.introTitle).toBe("כותרת חדשה");
    expect(draft.editor.thankYouLink).toBe("https://evently360.com/new");
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("create-instant-form"));
    fireEvent.click(screen.getByTestId("create-instant-form"));
    await waitFor(() => expect(createMetaLeadForm).toHaveBeenCalledTimes(1));
    const payload = createMetaLeadForm.mock.calls[0][1] as {
      publishId?: string;
      adDraftId?: string;
      additionalAction: string;
      thankYouUrl: string;
      introTitle: string;
      questions: Array<{ label?: string }>;
    };
    expect(payload.publishId).toBeUndefined();
    expect(payload.adDraftId).toBeUndefined();
    expect(payload.additionalAction).toBe("website");
    expect(payload.thankYouUrl).toBe("https://evently360.com/new");
    expect(payload.introTitle).toBe("כותרת חדשה");
    expect(payload.questions.some((question) => question.label === "במה אתם מתעניינים?")).toBe(
      true
    );
    expect(onChange).not.toHaveBeenCalled();
    expect(onFormReady).not.toHaveBeenCalled();
    await waitFor(() => expect(onFormsRefresh).toHaveBeenCalled());
  });

  it("reopens the saved duplicate draft instead of the original Meta form", async () => {
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
        formDrafts={[
          {
            draftId: "draft_1",
            sourceFormId: "form_live",
            name: "אחרי שמירה",
            editor: {
              sourceFormId: "form_live",
              name: "אחרי שמירה",
              introTitle: "כותרת שמורה",
              thankYouLink: "https://evently360.com/saved",
              additionalAction: "website",
              locale: "he_IL",
              contactTypes: ["FULL_NAME"],
              customQuestions: [],
            },
          },
        ]}
        pages={[]}
        businessId="biz"
        onChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("lead-form-duplicate-form_live"));
    expect(await screen.findByTestId("lead-form-name")).toHaveValue("אחרי שמירה");
    fireEvent.click(screen.getByTestId("lead-form-step-intro"));
    expect(screen.getByTestId("lead-form-intro-title")).toHaveValue("כותרת שמורה");
    fireEvent.click(screen.getByTestId("lead-form-step-ending"));
    expect(screen.getByTestId("lead-form-thank-you-url")).toHaveValue(
      "https://evently360.com/saved"
    );
    expect(duplicateMetaLeadForm).not.toHaveBeenCalled();
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
