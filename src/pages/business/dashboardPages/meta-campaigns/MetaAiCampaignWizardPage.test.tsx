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
          <Route path="settings" element={<div>settings-page</div>} />
        </Route>
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
      { field: "promotedItem", answer: "service:123" }
    );
    expect(screen.queryByText("טיפול פנים")).toBeNull();
    expect(screen.getByTestId("meta-ai-progress").textContent).toContain("1 מתוך 5");
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
