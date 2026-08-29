import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import en from "../../../../i18n/locales/en.json";
import fs from "node:fs";
import path from "node:path";

const localeRef = { current: he as Record<string, unknown> };

function resolveKey(locale: unknown, key: string, opts?: Record<string, unknown>) {
  let value = key.split(".").reduce<unknown>(
    (acc, segment) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    locale
  );
  if (typeof value !== "string") return key;
  if (opts) {
    for (const [name, raw] of Object.entries(opts)) {
      value = value.replace(new RegExp(`{{${name}}}`, "g"), String(raw));
    }
  }
  return value;
}

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      resolveKey(localeRef.current, key, opts),
    i18n: { language: localeRef.current === en ? "en" : "he" },
  }),
}));

vi.mock("../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => (localeRef.current === en ? "ltr" : "rtl"),
}));

const api = vi.hoisted(() => ({
  startAiCampaignSession: vi.fn(),
  getAiCampaignSession: vi.fn(),
  answerAiCampaignSession: vi.fn(),
  sendAiCampaignMessage: vi.fn(),
  generateAiCampaign: vi.fn(),
  reviseAiCampaign: vi.fn(),
  patchAiCampaignProposal: vi.fn(),
  createAiCampaignMetaDraft: vi.fn(),
  confirmAiDraftLocations: vi.fn(),
  retryAiCampaignMetaDraft: vi.fn(),
  activateAiCampaign: vi.fn(),
  recommendAiCampaignAutomations: vi.fn(),
  enableAiCampaignAutomation: vi.fn(),
  enableAllAiCampaignAutomations: vi.fn(),
  dismissAiCampaignAutomation: vi.fn(),
  sessionStorageKey: (id: string) => `bizuply.meta-ai-campaign.session.${id}`,
}));

vi.mock("../../../../api/metaAiCampaignApi", () => api);

import MetaAiCampaignWizardPage from "./MetaAiCampaignWizardPage";

function sampleProposal(overrides: Record<string, unknown> = {}) {
  return {
    campaign: { name: "Facial — לידים", objectiveKey: "LEADS", metaObjective: "OUTCOME_LEADS" },
    adSet: {
      dailyBudget: { amount: 70, currency: "ILS" },
      lifetimeBudget: null,
      locations: [{ kind: "city", name: "חיפה", country: "IL" }],
      audience: {
        summary: "נשים באזור חיפה שמתעניינות בטיפולי פנים",
        ageMin: 25,
        ageMax: 45,
        gender: "female",
        interests: ["beauty"],
      },
      placements: { recommendation: "ADVANTAGE", surfaces: ["ADVANTAGE"] },
      optimizationKey: "LEAD_GENERATION",
    },
    creative: {
      primaryText: "השאירו פרטים ונחזור אליכן.",
      headline: "טיפול פנים בחיפה",
      description: "קליניקה מקומית",
      ctaKey: "SIGN_UP",
      media: { status: "MISSING", url: null, fileName: null, kind: null },
    },
    leadForm: {
      mode: "DRAFT",
      existingFormId: null,
      existingFormName: null,
      draft: {
        name: "Facial form",
        introTitle: "השאירו פרטים",
        introBody: "נחזור אליכן",
        thankYouTitle: "תודה",
        thankYouBody: "קיבלנו",
        fields: ["FULL_NAME", "PHONE"],
      },
    },
    strategy: {
      audienceWhy: "הקהל קרוב לעסק",
      creativeWhy: "הטקסט ברור",
      settingsWhy: "טופס לידים מתאים למטרה",
    },
    graphSafe: {
      objective: "OUTCOME_LEADS",
      optimizationGoal: "LEAD_GENERATION",
      cta: "SIGN_UP",
    },
    ...overrides,
  };
}

function readySession(overrides: Record<string, unknown> = {}) {
  return questionSession({
    status: "READY_FOR_GENERATION",
    question: null,
    missingFields: [],
    progress: { confirmed: 5, required: 5 },
    ready: {
      message: "מעולה, יש לי את כל המידע הדרוש להכנת הקמפיין.",
      generateEnabled: true,
      placeholder: null,
    },
    intent: {
      promotedItem: { state: "CONFIRMED", value: { name: "טיפול פנים" } },
      objective: { state: "CONFIRMED", value: { key: "LEADS" } },
      destination: { state: "CONFIRMED", value: { key: "LEAD_FORM" } },
    },
    generation: { status: "IDLE", meta: {} },
    proposal: null,
    ...overrides,
  });
}

function questionSession(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    sessionId: "sess-1",
    status: "COLLECTING",
    metaConnected: true,
    assistantMessage: "איזה שירות תרצה לקדם?",
    question: {
      field: "promotedItem",
      type: "single_select",
      message: "איזה שירות תרצה לקדם?",
      options: [
        { value: "service:123", label: "טיפול פנים" },
        { value: "service:456", label: "איפור קבוע" },
      ],
    },
    missingFields: ["promotedItem", "objective", "budget", "locations", "destination"],
    progress: { confirmed: 0, required: 5 },
    messages: [
      { role: "assistant", text: "מצאתי את Beauty Clinic." },
      { role: "assistant", text: "איזה שירות תרצה לקדם?" },
    ],
    ...overrides,
  };
}

function renderWizard() {
  return render(
    <MemoryRouter
      initialEntries={["/business/biz-1/dashboard/meta-campaigns/create-ai"]}
    >
      <Routes>
        <Route
          path="/business/:businessId/dashboard/meta-campaigns"
          element={<Outlet context={{ businessId: "biz-1" }} />}
        >
          <Route path="create-ai" element={<MetaAiCampaignWizardPage />} />
          <Route path="overview" element={<div>overview-page</div>} />
          <Route path="create" element={<div>manual-create-page</div>} />
          <Route path="edit/:campaignId" element={<div>edit-campaign-page</div>} />
          <Route path="settings" element={<div>settings-page</div>} />
        </Route>
        <Route
          path="/business/:businessId/dashboard/automations/:workflowId"
          element={<div>automation-editor-page</div>}
        />
        <Route
          path="/business/:businessId/dashboard/whatsapp/settings"
          element={<div>whatsapp-settings-page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("MetaAiCampaignWizardPage conversation", () => {
  beforeEach(() => {
    localeRef.current = he as Record<string, unknown>;
    sessionStorage.clear();
    vi.clearAllMocks();
    api.startAiCampaignSession.mockResolvedValue(questionSession());
    api.getAiCampaignSession.mockRejectedValue(new Error("missing"));
  });

  it("loads a collector/session and shows the loading state first", async () => {
    let resolveStart: (value: unknown) => void = () => undefined;
    api.startAiCampaignSession.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStart = resolve;
        })
    );
    renderWizard();
    expect(screen.getByTestId("meta-ai-loading")).toBeTruthy();
    expect(screen.getByText(he.metaCampaigns.ai.checking)).toBeTruthy();
    resolveStart(questionSession());
    await waitFor(() => expect(screen.getByTestId("meta-ai-question")).toBeTruthy());
    expect(api.startAiCampaignSession).toHaveBeenCalled();
  });

  it("renders a single-select question and advances on answer", async () => {
    const next = questionSession({
      question: {
        field: "objective",
        type: "single_select",
        message: "מה המטרה העיקרית של הקמפיין?",
        options: [{ value: "LEADS", label: "קבלת לידים" }],
      },
      missingFields: ["objective", "budget", "locations", "destination"],
      progress: { confirmed: 1, required: 5 },
      assistantMessage: "מה המטרה העיקרית של הקמפיין?",
    });
    api.answerAiCampaignSession.mockResolvedValue(next);
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-question"));
    expect(screen.getByTestId("meta-ai-question").getAttribute("data-type")).toBe(
      "single_select"
    );
    fireEvent.click(screen.getByRole("button", { name: "טיפול פנים" }));
    await waitFor(() =>
      expect(screen.getByText("מה המטרה העיקרית של הקמפיין?")).toBeTruthy()
    );
    expect(api.answerAiCampaignSession).toHaveBeenCalledWith(
      "biz-1",
      "sess-1",
      {
        field: "promotedItem",
        answer: {
          value: "service:123",
          label: "טיפול פנים",
          itemType: undefined,
          itemId: undefined,
          itemName: undefined,
        },
      }
    );
    expect(screen.queryByText("טיפול פנים")).toBeNull();
    expect(screen.getByTestId("meta-ai-progress").textContent).toContain("1 מתוך 5");
    expect(screen.queryByText("OTHER")).toBeNull();
  });

  it("renders OTHER as שירות אחר and opens a text input", async () => {
    api.answerAiCampaignSession.mockResolvedValue(
      questionSession({
        question: {
          field: "promotedItem",
          type: "text",
          message: "מה תרצה לקדם?",
          placeholder: "הקלד את השירות או המוצר שתרצה לקדם",
        },
        messages: [
          { role: "assistant", text: "איזה שירות תרצה לקדם?" },
          { role: "user", text: "שירות אחר" },
          { role: "assistant", text: "מה תרצה לקדם?" },
        ],
      })
    );
    api.startAiCampaignSession.mockResolvedValue(
      questionSession({
        question: {
          field: "promotedItem",
          type: "single_select",
          message: "איזה שירות תרצה לקדם?",
          options: [
            { value: "service:123", label: "טיפול פנים" },
            { value: "OTHER", label: "שירות אחר" },
          ],
        },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-options"));
    fireEvent.click(screen.getByRole("button", { name: "שירות אחר" }));
    await waitFor(() => screen.getByTestId("meta-ai-text"));
    expect(screen.getByTestId("meta-ai-question").getAttribute("data-type")).toBe("text");
    expect(screen.queryByText("OTHER")).toBeNull();
    expect(screen.getByText("שירות אחר")).toBeTruthy();
    expect(screen.getByPlaceholderText("הקלד את השירות או המוצר שתרצה לקדם")).toBeTruthy();
  });

  it("does not keep a duplicated promotedItem question after submit", async () => {
    api.answerAiCampaignSession.mockResolvedValue(
      questionSession({
        question: {
          field: "objective",
          type: "single_select",
          message: "מה המטרה העיקרית של הקמפיין?",
          options: [{ value: "LEADS", label: "קבלת לידים" }],
        },
        progress: { confirmed: 1, required: 5 },
        messages: [
          { role: "user", text: "טיפול פנים" },
          { role: "assistant", text: "מה המטרה העיקרית של הקמפיין?" },
        ],
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-question"));
    fireEvent.click(screen.getByRole("button", { name: "טיפול פנים" }));
    await waitFor(() =>
      expect(screen.getByTestId("meta-ai-question").getAttribute("data-field")).toBe(
        "objective"
      )
    );
    expect(screen.getAllByText("מה המטרה העיקרית של הקמפיין?")).toHaveLength(1);
  });

  it("restores the current step from a server GET after refresh", async () => {
    api.getAiCampaignSession.mockResolvedValue(
      questionSession({
        question: {
          field: "objective",
          type: "single_select",
          message: "מה המטרה העיקרית של הקמפיין?",
          options: [{ value: "LEADS", label: "קבלת לידים" }],
        },
        progress: { confirmed: 1, required: 5 },
      })
    );
    sessionStorage.setItem("bizuply.meta-ai-campaign.session.biz-1", "sess-1");
    renderWizard();
    await waitFor(() =>
      expect(screen.getByTestId("meta-ai-question").getAttribute("data-field")).toBe(
        "objective"
      )
    );
    expect(screen.getByTestId("meta-ai-progress").textContent).toContain("1 מתוך 5");
    expect(api.startAiCampaignSession).not.toHaveBeenCalled();
  });

  it("shows the generation CTA at 5/5", async () => {
    api.startAiCampaignSession.mockResolvedValue({
      ...questionSession(),
      status: "READY_FOR_GENERATION",
      question: null,
      progress: { confirmed: 5, required: 5 },
      ready: {
        message: "מעולה, יש לי את כל המידע הדרוש להכנת הקמפיין.",
        generateEnabled: true,
      },
    });
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-generate"));
    expect(screen.getByText(he.metaCampaigns.ai.readyGenerate)).toBeTruthy();
  });

  it("renders a currency question", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      questionSession({
        question: {
          field: "budget",
          type: "currency",
          currency: "ILS",
          message: "מה התקציב היומי שתרצה להשקיע?",
          options: [{ value: "RECOMMEND", label: "תמליץ לי" }],
        },
        assistantMessage: "מה התקציב היומי שתרצה להשקיע?",
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-currency"));
    expect(screen.getByTestId("meta-ai-question").getAttribute("data-type")).toBe(
      "currency"
    );
    expect(screen.getByRole("button", { name: "תמליץ לי" })).toBeTruthy();
  });

  it("renders a confirmation question", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      questionSession({
        question: {
          field: "locations",
          type: "confirm",
          message: "העסק שלך מוגדר בחיפה. תרצה לפרסם בחיפה והסביבה?",
          options: [
            { value: "CONFIRM_SUGGESTED", label: "כן" },
            { value: "ALL_IL", label: "כל ישראל" },
          ],
        },
        assistantMessage: "העסק שלך מוגדר בחיפה. תרצה לפרסם בחיפה והסביבה?",
      })
    );
    renderWizard();
    await waitFor(() =>
      expect(screen.getByTestId("meta-ai-question").getAttribute("data-type")).toBe(
        "confirm"
      )
    );
    expect(screen.getByRole("button", { name: "כן" })).toBeTruthy();
  });

  it("enables generation only when the session is READY_FOR_GENERATION", async () => {
    api.startAiCampaignSession.mockResolvedValue(readySession());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-ready"));
    const generate = screen.getByTestId("meta-ai-generate") as HTMLButtonElement;
    expect(generate.disabled).toBe(false);
    expect(generate.textContent).toContain(he.metaCampaigns.ai.readyGenerate);
    expect(screen.queryByTestId("meta-ai-composer")).toBeNull();
  });

  it("opens the preview after generation and keeps missing creative visible", async () => {
    api.startAiCampaignSession.mockResolvedValue(readySession());
    api.generateAiCampaign.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: {
          status: "READY",
          meta: {
            availableLeadForms: [{ id: "form_9", name: "Clinic form" }],
            durationMs: 42,
          },
        },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-generate"));
    fireEvent.click(screen.getByTestId("meta-ai-generate"));
    await waitFor(() => screen.getByTestId("meta-ai-preview"));
    expect(api.generateAiCampaign).toHaveBeenCalledWith("biz-1", "sess-1", false);
    expect(screen.getByText(he.metaCampaigns.ai.preview.title)).toBeTruthy();
    expect(screen.getByTestId("meta-ai-missing-creative").textContent).toContain(
      he.metaCampaigns.ai.preview.missingCreative
    );
    expect(screen.getByTestId("meta-ai-lead-form")).toBeTruthy();
    expect(screen.getByText("טיפול פנים בחיפה")).toBeTruthy();
    expect(screen.getByText("השאירו פרטים ונחזור אליכן.")).toBeTruthy();
  });

  it("sends a partial AI revision and a regenerate from the same session", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: { status: "READY", meta: {} },
      })
    );
    api.reviseAiCampaign.mockResolvedValue(
      readySession({
        proposal: sampleProposal({
          creative: {
            ...sampleProposal().creative,
            headline: "כותרת רכה",
          },
        }),
        generation: { status: "READY", meta: { changedPaths: ["creative.headline"] } },
      })
    );
    api.generateAiCampaign.mockResolvedValue(
      readySession({
        proposal: sampleProposal({ campaign: { name: "Facial v2", objectiveKey: "LEADS", metaObjective: "OUTCOME_LEADS" } }),
        generation: { status: "READY", meta: { mode: "regenerate" } },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-revise"));
    fireEvent.change(screen.getByPlaceholderText(he.metaCampaigns.ai.preview.revisePlaceholder), {
      target: { value: "תן לי כותרת פחות מכירתית" },
    });
    fireEvent.click(screen.getByRole("button", { name: he.metaCampaigns.ai.preview.reviseSubmit }));
    await waitFor(() =>
      expect(api.reviseAiCampaign).toHaveBeenCalledWith(
        "biz-1",
        "sess-1",
        "תן לי כותרת פחות מכירתית"
      )
    );
    fireEvent.click(screen.getByTestId("meta-ai-regenerate"));
    await waitFor(() =>
      expect(api.generateAiCampaign).toHaveBeenCalledWith("biz-1", "sess-1", true)
    );
  });

  it("patches CTA locally without calling OpenAI generate or revise", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: { status: "READY", meta: {} },
      })
    );
    api.patchAiCampaignProposal.mockResolvedValue(
      readySession({
        proposal: sampleProposal({
          creative: { ...sampleProposal().creative, ctaKey: "LEARN_MORE" },
        }),
        generation: { status: "READY", meta: {} },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-cta"));
    fireEvent.change(screen.getByTestId("meta-ai-cta"), {
      target: { value: "LEARN_MORE" },
    });
    await waitFor(() =>
      expect(api.patchAiCampaignProposal).toHaveBeenCalledWith(
        "biz-1",
        "sess-1",
        { creative: { ctaKey: "LEARN_MORE" } }
      )
    );
    expect(api.generateAiCampaign).not.toHaveBeenCalled();
    expect(api.reviseAiCampaign).not.toHaveBeenCalled();
  });

  it("hands the proposal to the existing Ads Manager for manual edit", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: { status: "READY", meta: {} },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-manual-edit"));
    fireEvent.click(screen.getByTestId("meta-ai-manual-edit"));
    await waitFor(() => screen.getByText("manual-create-page"));
  });

  it("renders English preview copy", async () => {
    localeRef.current = en as Record<string, unknown>;
    api.startAiCampaignSession.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: { status: "READY", meta: {} },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByText(en.metaCampaigns.ai.preview.title));
    expect(screen.getByText(en.metaCampaigns.ai.preview.manualEdit)).toBeTruthy();
    expect(screen.getByText(en.metaCampaigns.ai.preview.regenerate)).toBeTruthy();
  });

  it("keeps preview actions stacked on mobile", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: { status: "READY", meta: {} },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-revise"));
    expect(screen.getByTestId("meta-ai-revise").className).toMatch(/flex-col/);
    expect(screen.getByTestId("meta-ai-revise").className).toMatch(/sm:flex-row/);
  });

  it("links the manual fallback to /create", async () => {
    api.startAiCampaignSession.mockRejectedValue({
      response: {
        status: 503,
        data: {
          message: he.metaCampaigns.ai.aiUnavailable,
          details: { retry: true, manualPath: "create" },
        },
      },
    });
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-manual-fallback"));
    expect(screen.getByTestId("meta-ai-manual-fallback").getAttribute("href")).toBe(
      "/business/biz-1/dashboard/meta-campaigns/create"
    );
    expect(screen.getByText(he.metaCampaigns.ai.aiUnavailable)).toBeTruthy();
  });

  it("restores a persisted session on refresh", async () => {
    sessionStorage.setItem("bizuply.meta-ai-campaign.session.biz-1", "sess-1");
    api.getAiCampaignSession.mockResolvedValue(questionSession());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-question"));
    expect(api.getAiCampaignSession).toHaveBeenCalledWith("biz-1", "sess-1");
    expect(api.startAiCampaignSession).not.toHaveBeenCalled();
  });

  it("renders English copy", async () => {
    localeRef.current = en as Record<string, unknown>;
    api.startAiCampaignSession.mockResolvedValue(
      questionSession({
        assistantMessage: "What should we promote?",
        question: {
          field: "promotedItem",
          type: "single_select",
          message: "What should we promote?",
          options: [{ value: "service:123", label: "Facial" }],
        },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByText(en.metaCampaigns.ai.title));
    expect(screen.getByText(en.metaCampaigns.ai.subtitle)).toBeTruthy();
    expect(screen.getByText("What should we promote?")).toBeTruthy();
  });

  it("uses responsive layout classes for mobile and desktop", async () => {
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-question"));
    const options = screen.getByTestId("meta-ai-options");
    expect(options?.className).toMatch(/flex-col/);
    expect(options?.className).toMatch(/sm:flex-row/);
  });

  it("shows a Meta connect CTA when disconnected", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      questionSession({ metaConnected: false })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-meta-disconnected"));
    expect(
      screen.getByRole("link", { name: he.metaCampaigns.ai.connectMeta }).getAttribute("href")
    ).toBe("/business/biz-1/dashboard/meta-campaigns/settings");
  });
});

function proposalReady(overrides: Record<string, unknown> = {}) {
  return readySession({
    proposal: sampleProposal({
      creative: {
        ...sampleProposal().creative,
        media: { status: "PROVIDED", url: "https://cdn.example/a.jpg", kind: "image" },
      },
    }),
    generation: { status: "READY", meta: {} },
    lifecycle: "PROPOSAL_READY",
    metaDraft: { status: "IDLE", pendingLocations: [], approvedDailyBudget: 70 },
    ...overrides,
  });
}

function draftedSession(overrides: Record<string, unknown> = {}) {
  return proposalReady({
    lifecycle: "META_DRAFT_CREATED",
    metaDraft: {
      status: "META_DRAFT_CREATED",
      campaignId: "120",
      adSetId: "121",
      adId: "122",
      approvedDailyBudget: 70,
      pendingLocations: [],
    },
    meta: { campaignId: "120", adSetId: "121", adId: "122", status: "PAUSED" },
    ...overrides,
  });
}

describe("Meta AI draft + explicit publish", () => {
  beforeEach(() => {
    localeRef.current = he as Record<string, unknown>;
    sessionStorage.clear();
    vi.clearAllMocks();
    api.getAiCampaignSession.mockRejectedValue(new Error("missing"));
  });

  it("shows the create CTA and paused warning", async () => {
    api.startAiCampaignSession.mockResolvedValue(proposalReady());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-create-draft"));
    expect(screen.getByText(he.metaCampaigns.ai.draft.approveCreate)).toBeTruthy();
    expect(screen.getByTestId("meta-ai-paused-warning").textContent).toContain(
      he.metaCampaigns.ai.draft.pausedWarning
    );
  });

  it("shows real creation progress without a fake percentage", async () => {
    let resolveDraft: (value: unknown) => void = () => undefined;
    api.startAiCampaignSession.mockResolvedValue(proposalReady());
    api.createAiCampaignMetaDraft.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDraft = resolve;
        })
    );
    api.getAiCampaignSession.mockResolvedValue(
      proposalReady({
        lifecycle: "CREATING_META_DRAFT",
        metaDraft: { status: "CREATING_META_DRAFT", stage: "media" },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-create-draft"));
    fireEvent.click(screen.getByTestId("meta-ai-create-draft"));
    await waitFor(() => screen.getByTestId("meta-ai-draft-progress"));
    expect(screen.getByText(he.metaCampaigns.ai.draft.creating)).toBeTruthy();
    expect(screen.queryByText("%")).toBeNull();
    resolveDraft(
      draftedSession()
    );
    await waitFor(() => screen.getByTestId("meta-ai-draft-success"));
  });

  it("blocks a double click from creating two drafts", async () => {
    api.startAiCampaignSession.mockResolvedValue(proposalReady());
    api.createAiCampaignMetaDraft.mockImplementation(
      () =>
        new Promise(() => {
          /* hang */
        })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-create-draft"));
    fireEvent.click(screen.getByTestId("meta-ai-create-draft"));
    expect(api.createAiCampaignMetaDraft).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("meta-ai-create-draft")).toBeNull();
    expect(screen.getByTestId("meta-ai-draft-progress")).toBeTruthy();
  });

  it("shows the paused success state after a Meta draft is created", async () => {
    api.startAiCampaignSession.mockResolvedValue(draftedSession());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-draft-success"));
    expect(screen.getByText(he.metaCampaigns.ai.draft.successTitle)).toBeTruthy();
    expect(screen.getByTestId("meta-ai-draft-status").textContent).toContain(
      he.metaCampaigns.ai.draft.statusPaused
    );
    expect(screen.getByTestId("meta-ai-draft-budget").textContent).toContain("70");
  });

  it("shows a Meta error and retry", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      proposalReady({
        lifecycle: "META_FAILED",
        metaDraft: { status: "META_FAILED", error: "Graph timeout" },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-draft-error"));
    expect(screen.getByText("Graph timeout")).toBeTruthy();
    fireEvent.click(screen.getByTestId("meta-ai-draft-retry"));
    await waitFor(() => expect(api.retryAiCampaignMetaDraft).toHaveBeenCalledWith("biz-1", "sess-1"));
  });

  it("blocks create when creative is missing", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      readySession({
        proposal: sampleProposal(),
        generation: { status: "READY", meta: {} },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-missing-creative"));
    expect((screen.getByTestId("meta-ai-create-draft") as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByTestId("meta-ai-draft-missing-creative")).toBeTruthy();
  });

  it("lets the user pick an unresolved location", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      proposalReady({
        metaDraft: {
          status: "IDLE",
          pendingLocations: [
            {
              query: "קריות",
              options: [
                { key: "1", name: "Kiryat Ata", type: "city" },
                { key: "2", name: "Kiryat Bialik", type: "city" },
              ],
            },
          ],
        },
      })
    );
    api.confirmAiDraftLocations.mockResolvedValue(draftedSession());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-location-unresolved"));
    expect(screen.getByText(he.metaCampaigns.ai.draft.locationUnresolved)).toBeTruthy();
    fireEvent.change(screen.getByTestId("meta-ai-location-option"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByTestId("meta-ai-location-confirm"));
    await waitFor(() =>
      expect(api.confirmAiDraftLocations).toHaveBeenCalledWith(
        "biz-1",
        "sess-1",
        [expect.objectContaining({ key: "1", name: "Kiryat Ata" })]
      )
    );
  });

  it("opens a publish confirmation with budget and stays paused on cancel", async () => {
    api.startAiCampaignSession.mockResolvedValue(draftedSession());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-publish"));
    fireEvent.click(screen.getByTestId("meta-ai-publish"));
    await waitFor(() => screen.getByTestId("meta-ai-publish-modal"));
    expect(screen.getByTestId("meta-ai-publish-budget").textContent).toContain("70");
    fireEvent.click(screen.getByTestId("meta-ai-publish-cancel"));
    await waitFor(() => expect(screen.queryByTestId("meta-ai-publish-modal")).toBeNull());
    expect(api.activateAiCampaign).not.toHaveBeenCalled();
    expect(screen.getByTestId("meta-ai-draft-status").textContent).toContain(
      he.metaCampaigns.ai.draft.statusPaused
    );
  });

  it("publishes only after explicit confirm and shows ACTIVE", async () => {
    api.startAiCampaignSession.mockResolvedValue(draftedSession());
    api.activateAiCampaign.mockResolvedValue(
      draftedSession({
        lifecycle: "PUBLISHED",
        metaDraft: { status: "PUBLISHED", campaignId: "120", approvedDailyBudget: 70 },
        meta: { campaignId: "120", status: "ACTIVE", budget: 70 },
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-publish"));
    fireEvent.click(screen.getByTestId("meta-ai-publish"));
    fireEvent.click(screen.getByTestId("meta-ai-publish-confirm"));
    await waitFor(() =>
      expect(api.activateAiCampaign).toHaveBeenCalledWith("biz-1", "sess-1", true)
    );
    await waitFor(() => screen.getByTestId("meta-ai-published"));
    expect(screen.getByText(he.metaCampaigns.ai.publish.successTitle)).toBeTruthy();
    expect(screen.getByTestId("meta-ai-active-campaign-id").textContent).toContain("120");
  });

  it("reports partial activation instead of a full success", async () => {
    api.startAiCampaignSession.mockResolvedValue(draftedSession());
    api.activateAiCampaign.mockRejectedValue({
      response: {
        status: 502,
        data: {
          message: he.metaCampaigns.ai.publish.partialTitle,
          details: {
            code: "PARTIAL_ACTIVATION",
            tree: { campaign: "ACTIVE", adSet: "PAUSED", ad: "PAUSED" },
          },
        },
      },
    });
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-publish"));
    fireEvent.click(screen.getByTestId("meta-ai-publish"));
    fireEvent.click(screen.getByTestId("meta-ai-publish-confirm"));
    await waitFor(() => screen.getByTestId("meta-ai-partial-tree"));
    expect(screen.queryByTestId("meta-ai-published")).toBeNull();
    expect(screen.getByTestId("meta-ai-partial-tree").textContent).toMatch(/ACTIVE/);
    expect(screen.getByTestId("meta-ai-partial-tree").textContent).toMatch(/PAUSED/);
  });

  it("renders English draft copy", async () => {
    localeRef.current = en as Record<string, unknown>;
    api.startAiCampaignSession.mockResolvedValue(proposalReady());
    renderWizard();
    await waitFor(() => screen.getByText(en.metaCampaigns.ai.draft.approveCreate));
    expect(screen.getByText(en.metaCampaigns.ai.draft.pausedWarning)).toBeTruthy();
  });

  it("keeps draft actions stacked on mobile", async () => {
    api.startAiCampaignSession.mockResolvedValue(draftedSession());
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-draft-success"));
    const row = screen.getByTestId("meta-ai-publish").parentElement;
    expect(row?.className).toMatch(/flex-col/);
    expect(row?.className).toMatch(/sm:flex-row/);
  });
});

describe("Meta AI campaign automations (H hidden from wizard)", () => {
  beforeEach(() => {
    localeRef.current = he as Record<string, unknown>;
    sessionStorage.clear();
    vi.clearAllMocks();
    api.getAiCampaignSession.mockRejectedValue(new Error("missing"));
  });

  it("does not load or show lead-follow-up automations in the wizard", async () => {
    api.startAiCampaignSession.mockResolvedValue(
      proposalReady({
        automationRecommendations: [
          {
            key: "meta_lead_whatsapp",
            status: "RECOMMENDED",
            name: "שליחת WhatsApp לליד חדש",
          },
        ],
      })
    );
    renderWizard();
    await waitFor(() => screen.getByTestId("meta-ai-preview"));
    expect(api.recommendAiCampaignAutomations).not.toHaveBeenCalled();
    expect(api.enableAiCampaignAutomation).not.toHaveBeenCalled();
    expect(api.enableAllAiCampaignAutomations).not.toHaveBeenCalled();
    expect(api.dismissAiCampaignAutomation).not.toHaveBeenCalled();
    expect(screen.queryByTestId("meta-ai-automations")).toBeNull();
    expect(screen.queryByTestId("meta-ai-automation-card")).toBeNull();
    expect(screen.queryByText(he.metaCampaigns.ai.automations.title)).toBeNull();
  });
});

describe("manual Ads Manager regression", () => {
  it("does not import AI session APIs into MetaAdsManagerPage", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "./ads-manager/MetaAdsManagerPage.tsx"),
      "utf8"
    );
    expect(source).not.toMatch(/metaAiCampaignApi/);
    expect(source).not.toMatch(/startAiCampaignSession/);
  });
});
