import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import en from "../../../../../i18n/locales/en.json";

const createMetaLeadForm = vi.fn();
const syncMetaLeadForm = vi.fn();
const saveMetaLeadFormDraft = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("../../../../../api/whatsappApi", () => ({
  getWhatsAppStatus: vi.fn().mockResolvedValue({ connected: false }),
}));

vi.mock("../../../../../api/metaCampaignsApi", () => ({
  createMetaLeadForm: (...args: unknown[]) => createMetaLeadForm(...args),
  syncMetaLeadForm: (...args: unknown[]) => syncMetaLeadForm(...args),
  saveMetaLeadFormDraft: (...args: unknown[]) => saveMetaLeadFormDraft(...args),
}));

vi.mock("../../../../../i18n/i18n", () => ({
  default: {
    t: (key: string) => key,
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const value = resolveKey(en, key);
      return typeof value === "string" ? value : key;
    },
    i18n: { language: "en" },
  }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

import AdsManagerCreateLeadFormModal from "./AdsManagerCreateLeadFormModal";
import type { LeadFormDuplicateSeed } from "./leadFormDuplicateSeed";

function resolveKey(locale: unknown, key: string) {
  return key.split(".").reduce<unknown>(
    (acc, segment) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    locale
  );
}

function renderModal(onCreated = vi.fn()) {
  return render(
    <MemoryRouter>
      <AdsManagerCreateLeadFormModal
        open
        businessId="biz-1"
        pageId="page-1"
        pageName="Eventy"
        publishId="pub-1"
        adDraftId="ad-1"
        onClose={vi.fn()}
        onCreated={onCreated}
      />
    </MemoryRouter>
  );
}

async function reachSubmit() {
  for (let step = 0; step < 4; step += 1) {
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  }
  const link = screen.getByPlaceholderText("https://");
  fireEvent.change(link, { target: { value: "https://eventy360.com" } });
}

const duplicateSeed: LeadFormDuplicateSeed = {
  sourceFormId: "1503689644979003",
  name: "טופס לידים - עותק",
  formType: "volume",
  requireSms: false,
  introTitle: "כותרת מקור",
  introDescription: "תיאור מקור",
  privacyUrl: "https://evently360.com/privacy-policy",
  thankYouTitle: "תודה",
  thankYouBody: "הפרטים התקבלו",
  thankYouButton: "בואו להכיר את Evently360",
  additionalAction: "website",
  thankYouLink: "https://evently360.com/",
  callPhone: "",
  whatsappPhone: "",
  locale: "he_IL",
  sharing: "restricted",
  contactTypes: ["FULL_NAME", "PHONE"],
  customQuestions: [
    {
      id: "q1",
      label: "במה אתם מתעניינים?",
      answerType: "short_answer",
      options: [],
    },
  ],
  contactFieldKeys: {},
};

describe("AdsManagerCreateLeadFormModal", () => {
  beforeEach(() => {
    createMetaLeadForm.mockReset();
    syncMetaLeadForm.mockReset();
    saveMetaLeadFormDraft.mockReset();
    saveMetaLeadFormDraft.mockResolvedValue({ success: true, savedOnMeta: false });
  });

  it("shows a loading state and a success message only after Meta confirms the form", async () => {
    let resolveCreate: (value: unknown) => void = () => undefined;
    createMetaLeadForm.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
    );
    const onCreated = vi.fn();
    renderModal(onCreated);
    await reachSubmit();

    fireEvent.click(screen.getByTestId("create-instant-form"));
    fireEvent.click(screen.getByTestId("create-instant-form"));

    expect(createMetaLeadForm).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("instant-form-status").textContent).toContain(
      "Creating the form..."
    );
    expect(screen.queryByText("The form was created and saved")).toBeNull();

    resolveCreate({
      success: true,
      confirmedByMeta: true,
      savedLocally: true,
      form: { id: "form_1", name: "Leads", pageId: "page-1" },
      leadIntake: { active: true },
    });

    expect(await screen.findByText("The form was created and saved")).toBeTruthy();
    expect(onCreated).toHaveBeenCalledWith({
      id: "form_1",
      name: "Leads",
      pageId: "page-1",
    });
    const payload = createMetaLeadForm.mock.calls[0][1] as {
      pageId: string;
      idempotencyKey: string;
      publishId: string;
      adDraftId: string;
      questions: unknown[];
    };
    expect(payload.pageId).toBe("page-1");
    expect(payload.publishId).toBe("pub-1");
    expect(payload.adDraftId).toBe("ad-1");
    expect(payload.idempotencyKey).toBeTruthy();
    expect(payload.questions.length).toBeGreaterThan(0);
  });

  it("shows the Hebrew-ready API error and does not report success", async () => {
    createMetaLeadForm.mockRejectedValue({
      response: {
        data: {
          error: "אין הרשאה ליצור טופס לידים. התחברו מחדש ל-Meta ואשרו את הרשאת הטפסים (pages_manage_ads).",
        },
      },
    });
    const onCreated = vi.fn();
    renderModal(onCreated);
    await reachSubmit();
    fireEvent.click(screen.getByTestId("create-instant-form"));

    expect(await screen.findByText(/pages_manage_ads/)).toBeTruthy();
    expect(screen.queryByText("The form was created and saved")).toBeNull();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("does not show success when Meta returns no form id", async () => {
    createMetaLeadForm.mockResolvedValue({
      success: true,
      confirmedByMeta: false,
      savedLocally: false,
      form: {},
    });
    renderModal();
    await reachSubmit();
    fireEvent.click(screen.getByTestId("create-instant-form"));

    expect(await screen.findByText("Meta did not return a form ID")).toBeTruthy();
    expect(screen.queryByText("The form was created and saved")).toBeNull();
  });

  it("syncs a Meta form that was not saved locally without creating another one", async () => {
    createMetaLeadForm.mockResolvedValue({
      success: true,
      confirmedByMeta: true,
      savedLocally: false,
      form: { id: "form_sync", name: "Leads", pageId: "page-1" },
    });
    syncMetaLeadForm.mockResolvedValue({
      success: true,
      confirmedByMeta: true,
      savedLocally: true,
      recovered: true,
      form: { id: "form_sync", name: "Leads", pageId: "page-1" },
      leadIntake: { active: true },
    });
    const onCreated = vi.fn();
    renderModal(onCreated);
    await reachSubmit();
    fireEvent.click(screen.getByTestId("create-instant-form"));

    expect(
      await screen.findByText(/saving it in Bizuply failed/)
    ).toBeTruthy();
    expect(screen.queryByText("The form was created and saved")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Sync to Bizuply" }));
    expect(await screen.findByText(/already exists on Meta/)).toBeTruthy();
    expect(syncMetaLeadForm).toHaveBeenCalledTimes(1);
    expect(createMetaLeadForm).toHaveBeenCalledTimes(1);
    expect(onCreated).toHaveBeenCalledWith({
      id: "form_sync",
      name: "Leads",
      pageId: "page-1",
    });
  });

  it("keeps a duplicate editable and sends the website only when creating the form", async () => {
    createMetaLeadForm.mockResolvedValue({
      success: true,
      confirmedByMeta: true,
      savedLocally: true,
      form: { id: "form_new", name: "טופס לידים - עותק", pageId: "page-1" },
    });
    const onCreated = vi.fn();
    const view = render(
      <MemoryRouter>
        <AdsManagerCreateLeadFormModal
          open
          mode="duplicate"
          initialDraft={duplicateSeed}
          businessId="biz-1"
          pageId="page-1"
          pageName="Evently360"
          publishId="pub-1"
          adDraftId="ad-1"
          onClose={vi.fn()}
          onCreated={onCreated}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Duplicate form" })).toBeTruthy();
    expect(screen.getByTestId("lead-form-name")).toHaveValue("טופס לידים - עותק");
    expect(screen.getByText(/Form preview/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Instagram" })).toBeTruthy();
    fireEvent.click(screen.getByTestId("lead-form-step-intro"));
    expect(screen.getByTestId("lead-form-intro-title")).toHaveValue("כותרת מקור");
    fireEvent.change(screen.getByTestId("lead-form-intro-title"), {
      target: { value: "כותרת חדשה" },
    });
    expect(screen.getByText("כותרת חדשה")).toBeTruthy();
    fireEvent.click(screen.getByTestId("lead-form-step-ending"));
    expect(screen.getByTestId("lead-form-thank-you-url")).toHaveValue(
      "https://evently360.com/"
    );
    fireEvent.change(screen.getByTestId("lead-form-thank-you-url"), {
      target: { value: "https://evently360.com/hello" },
    });

    fireEvent.click(screen.getByTestId("save-lead-form-draft"));
    expect(createMetaLeadForm).not.toHaveBeenCalled();
    expect(await screen.findByText(/The draft was saved in Bizuply/)).toBeTruthy();
    expect(screen.getByTestId("create-instant-form")).not.toBeDisabled();
    const saved = saveMetaLeadFormDraft.mock.calls[0][1] as {
      editor: LeadFormDuplicateSeed;
    };

    view.unmount();
    render(
      <MemoryRouter>
        <AdsManagerCreateLeadFormModal
          open
          mode="duplicate"
          initialDraft={saved.editor}
          businessId="biz-1"
          pageId="page-1"
          pageName="Evently360"
          publishId="pub-1"
          onClose={vi.fn()}
          onCreated={onCreated}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("lead-form-step-intro"));
    expect(screen.getByTestId("lead-form-intro-title")).toHaveValue("כותרת חדשה");
    fireEvent.click(screen.getByTestId("lead-form-step-ending"));
    expect(screen.getByTestId("lead-form-thank-you-url")).toHaveValue(
      "https://evently360.com/hello"
    );

    fireEvent.click(screen.getByTestId("create-instant-form"));
    fireEvent.click(screen.getByTestId("create-instant-form"));
    expect(createMetaLeadForm).toHaveBeenCalledTimes(1);
    const payload = createMetaLeadForm.mock.calls[0][1] as {
      thankYouUrl: string;
      additionalAction: string;
      introTitle: string;
      publishId?: string;
      adDraftId?: string;
    };
    expect(payload.thankYouUrl).toBe("https://evently360.com/hello");
    expect(payload.additionalAction).toBe("website");
    expect(payload.introTitle).toBe("כותרת חדשה");
    expect(payload.publishId).toBeUndefined();
    expect(payload.adDraftId).toBeUndefined();
    expect(await screen.findByText("The form was created and saved")).toBeTruthy();
    expect(onCreated).toHaveBeenCalledWith({
      id: "form_new",
      name: "טופס לידים - עותק",
      pageId: "page-1",
    });
    expect(saveMetaLeadFormDraft).toHaveBeenCalledWith(
      "biz-1",
      expect.objectContaining({ sourceFormId: "1503689644979003", discard: true })
    );
  });

  it("does not treat the original form as a successful duplicate", async () => {
    createMetaLeadForm.mockResolvedValue({
      success: true,
      confirmedByMeta: true,
      savedLocally: true,
      form: { id: "1503689644979003", name: "טופס לידים", pageId: "page-1" },
    });
    const onCreated = vi.fn();
    render(
      <MemoryRouter>
        <AdsManagerCreateLeadFormModal
          open
          mode="duplicate"
          initialDraft={duplicateSeed}
          businessId="biz-1"
          pageId="page-1"
          pageName="Evently360"
          onClose={vi.fn()}
          onCreated={onCreated}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("create-instant-form"));
    expect(await screen.findByText(/matches the original form/)).toBeTruthy();
    expect(onCreated).not.toHaveBeenCalled();
    expect(saveMetaLeadFormDraft).not.toHaveBeenCalled();
  });

  it("shows the fields Meta accepts for each thank-you action", () => {
    renderModal();
    fireEvent.click(screen.getByTestId("lead-form-step-ending"));

    expect(screen.getByTestId("lead-form-thank-you-url")).toBeTruthy();
    expect(screen.queryByTestId("lead-form-call-phone")).toBeNull();
    fireEvent.change(screen.getByTestId("lead-form-thank-you-url"), {
      target: { value: "https://evently360.com/hello" },
    });
    expect(screen.getByTestId("lead-form-preview-action").textContent).toContain(
      "Go to website"
    );
    expect(screen.getByTestId("lead-form-preview-action").textContent).toContain(
      "https://evently360.com/hello"
    );

    fireEvent.click(screen.getByTestId("lead-form-action-call"));
    expect(screen.getByTestId("lead-form-call-phone")).toBeTruthy();
    expect(screen.queryByTestId("lead-form-thank-you-url")).toBeNull();
    fireEvent.change(screen.getByTestId("lead-form-call-phone"), {
      target: { value: "+972501234567" },
    });
    expect(screen.getByTestId("lead-form-preview-action").textContent).toContain(
      "Call business"
    );
    expect(screen.getByTestId("lead-form-preview-action").textContent).toContain(
      "+972501234567"
    );

    fireEvent.click(screen.getByTestId("lead-form-action-file"));
    expect(screen.getByTestId("lead-form-thank-you-url")).toBeTruthy();
    expect(screen.getByText(/not previewed inside the form/)).toBeTruthy();

    fireEvent.click(screen.getByTestId("lead-form-action-whatsapp"));
    expect(screen.getByTestId("lead-form-whatsapp-phone")).toBeTruthy();
    expect(screen.getByText(/connected to the Facebook Page/)).toBeTruthy();
    expect(screen.queryByTestId("lead-form-thank-you-url")).toBeNull();
  });
});
