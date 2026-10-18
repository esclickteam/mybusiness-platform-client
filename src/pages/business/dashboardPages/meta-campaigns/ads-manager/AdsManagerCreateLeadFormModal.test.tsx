import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import en from "../../../../../i18n/locales/en.json";

const createMetaLeadForm = vi.fn();
const syncMetaLeadForm = vi.fn();

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("../../../../../api/whatsappApi", () => ({
  getWhatsAppStatus: vi.fn().mockResolvedValue({ connected: false }),
}));

vi.mock("../../../../../api/metaCampaignsApi", () => ({
  createMetaLeadForm: (...args: unknown[]) => createMetaLeadForm(...args),
  syncMetaLeadForm: (...args: unknown[]) => syncMetaLeadForm(...args),
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

describe("AdsManagerCreateLeadFormModal", () => {
  beforeEach(() => {
    createMetaLeadForm.mockReset();
    syncMetaLeadForm.mockReset();
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
});
