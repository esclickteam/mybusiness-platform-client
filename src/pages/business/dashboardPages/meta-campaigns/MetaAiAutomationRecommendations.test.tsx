import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import en from "../../../../i18n/locales/en.json";
import MetaAiAutomationRecommendations from "./MetaAiAutomationRecommendations";
import type { AiCampaignSessionResponse } from "../../../../api/metaAiCampaignApi";

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

function sessionWith(
  recs: AiCampaignSessionResponse["automationRecommendations"]
): AiCampaignSessionResponse {
  return {
    sessionId: "sess-1",
    status: "READY_FOR_GENERATION",
    assistantMessage: "",
    question: null,
    missingFields: [],
    progress: { confirmed: 5, required: 5 },
    automationRecommendations: recs,
  };
}

function renderRecs(
  recs: AiCampaignSessionResponse["automationRecommendations"],
  extra: Partial<React.ComponentProps<typeof MetaAiAutomationRecommendations>> = {}
) {
  const onEnable = vi.fn();
  const onEnableAll = vi.fn();
  const onDismiss = vi.fn();
  render(
    <MemoryRouter>
      <div className="max-w-sm">
        <MetaAiAutomationRecommendations
          session={sessionWith(recs)}
          businessId="biz-1"
          loading={false}
          enablingKey={null}
          enableAllResult={null}
          onEnable={onEnable}
          onEnableAll={onEnableAll}
          onDismiss={onDismiss}
          {...extra}
        />
      </div>
    </MemoryRouter>
  );
  return { onEnable, onEnableAll, onDismiss };
}

const recommended = [
  {
    key: "meta_lead_whatsapp",
    status: "RECOMMENDED" as const,
    name: "שליחת WhatsApp לליד חדש",
    description: "כאשר ליד מגיע מהקמפיין, שלח לו הודעת WhatsApp באופן אוטומטי.",
  },
  {
    key: "meta_lead_task",
    status: "RECOMMENDED" as const,
    name: "צור משימת מעקב",
    description: "כאשר מגיע ליד חדש, צור משימה לצוות לחזור אליו.",
  },
  {
    key: "meta_lead_followup",
    status: "RECOMMENDED" as const,
    name: "Follow-up לאחר 24 שעות",
    description: "אם הליד עדיין לא טופל, שלח הודעת המשך.",
  },
];

describe("MetaAiAutomationRecommendations", () => {
  it("loads the recommendations section", () => {
    localeRef.current = he;
    renderRecs(recommended);
    expect(screen.getByTestId("meta-ai-automations")).toBeTruthy();
    expect(screen.getByText(he.metaCampaigns.ai.automations.title)).toBeTruthy();
    expect(screen.getAllByTestId("meta-ai-automation-card")).toHaveLength(3);
  });

  it("shows the empty state", () => {
    localeRef.current = he;
    renderRecs([]);
    expect(screen.getByTestId("meta-ai-automations-empty").textContent).toContain(
      he.metaCampaigns.ai.automations.empty
    );
  });

  it("shows the WhatsApp unavailable state with a connect CTA", () => {
    localeRef.current = he;
    renderRecs([
      {
        key: "meta_lead_whatsapp",
        status: "UNAVAILABLE",
        name: "שליחת WhatsApp לליד חדש",
        blockedReason: "WHATSAPP_DISCONNECTED",
      },
    ]);
    expect(screen.getByText(he.metaCampaigns.ai.automations.needsWhatsApp)).toBeTruthy();
    expect(
      screen.getByTestId("meta-ai-automation-wa-connect").getAttribute("href")
    ).toBe("/business/biz-1/dashboard/whatsapp/settings");
    expect(screen.queryByTestId("meta-ai-automation-enable")).toBeNull();
  });

  it("enables a single recommendation", () => {
    localeRef.current = he;
    const { onEnable } = renderRecs([recommended[1]]);
    fireEvent.click(screen.getByTestId("meta-ai-automation-enable"));
    expect(onEnable).toHaveBeenCalledWith("meta_lead_task");
  });

  it("enables all when more than one recommendation is ready", () => {
    localeRef.current = he;
    const { onEnableAll } = renderRecs(recommended);
    fireEvent.click(screen.getByTestId("meta-ai-automation-enable-all"));
    expect(onEnableAll).toHaveBeenCalled();
  });

  it("shows a loading state", () => {
    localeRef.current = he;
    renderRecs([], { loading: true });
    expect(screen.getByTestId("meta-ai-automations-loading").textContent).toContain(
      he.metaCampaigns.ai.automations.loading
    );
  });

  it("shows a partial enable-all result", () => {
    localeRef.current = he;
    renderRecs(recommended, {
      enableAllResult: {
        enabledCount: 3,
        failedCount: 1,
        failed: [{ key: "meta_lead_whatsapp", reason: "WHATSAPP_TEMPLATE_REQUIRED" }],
      },
    });
    expect(screen.getByTestId("meta-ai-automations-partial").textContent).toContain(
      "3"
    );
    expect(screen.getByTestId("meta-ai-automations-partial").textContent).toContain(
      "1"
    );
    expect(screen.getByText(/WHATSAPP_TEMPLATE_REQUIRED/)).toBeTruthy();
  });

  it("shows the already-active state and edit link", () => {
    localeRef.current = he;
    renderRecs([
      {
        key: "meta_lead_task",
        status: "CREATED",
        name: "צור משימת מעקב",
        automationWorkflowId: "wf-9",
      },
    ]);
    expect(screen.getByTestId("meta-ai-automation-active").textContent).toContain(
      he.metaCampaigns.ai.automations.active
    );
    expect(screen.getByTestId("meta-ai-automation-edit").getAttribute("href")).toBe(
      "/business/biz-1/dashboard/automations/wf-9"
    );
  });

  it("shows a dismissed recommendation", () => {
    localeRef.current = he;
    renderRecs([
      {
        key: "meta_lead_task",
        status: "DISMISSED",
        name: "צור משימת מעקב",
      },
    ]);
    expect(screen.getByTestId("meta-ai-automation-dismissed").textContent).toContain(
      he.metaCampaigns.ai.automations.dismissed
    );
    expect(screen.queryByTestId("meta-ai-automation-enable")).toBeNull();
  });

  it("renders HE and EN copy", () => {
    localeRef.current = en;
    renderRecs(recommended);
    expect(screen.getByText(en.metaCampaigns.ai.automations.title)).toBeTruthy();
    expect(screen.getByText(en.metaCampaigns.ai.automations.enableAll)).toBeTruthy();
    localeRef.current = he;
  });

  it("keeps cards in a single column on mobile widths", () => {
    localeRef.current = he;
    renderRecs(recommended);
    const section = screen.getByTestId("meta-ai-automations");
    expect(section.querySelector(".grid-cols-1")).toBeTruthy();
  });
});
