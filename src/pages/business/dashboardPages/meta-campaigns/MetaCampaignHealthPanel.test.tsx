import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import he from "../../../../i18n/locales/he.json";
import en from "../../../../i18n/locales/en.json";
import MetaCampaignHealthPanel from "./MetaCampaignHealthPanel";
import type { AiCampaignRecommendation, CampaignHealth } from "../../../../api/metaCampaignsApi";

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

const getMetaCampaignHealth = vi.fn();
const listAiCampaignRecommendations = vi.fn();
const dismissAiCampaignRecommendation = vi.fn();
const viewAiCampaignRecommendation = vi.fn();

vi.mock("../../../../api/metaCampaignsApi", async () => {
  const actual = await vi.importActual<typeof import("../../../../api/metaCampaignsApi")>(
    "../../../../api/metaCampaignsApi"
  );
  return {
    ...actual,
    getMetaCampaignHealth: (...args: unknown[]) => getMetaCampaignHealth(...args),
    listAiCampaignRecommendations: (...args: unknown[]) =>
      listAiCampaignRecommendations(...args),
    dismissAiCampaignRecommendation: (...args: unknown[]) =>
      dismissAiCampaignRecommendation(...args),
    viewAiCampaignRecommendation: (...args: unknown[]) =>
      viewAiCampaignRecommendation(...args),
  };
});

function rec(
  overrides: Partial<AiCampaignRecommendation> = {}
): AiCampaignRecommendation {
  return {
    id: "rec-1",
    businessId: "biz-1",
    metaCampaignId: "120",
    campaignName: "Leads",
    sourceRuleKeys: ["CPL_INCREASED"],
    severity: "WARNING",
    title: "עלות הליד עלתה",
    finding: "עלות הליד עלתה ב-38% לעומת 7 הימים הקודמים.",
    explanation: "הירידה ב-CTR יכולה להעיד על שחיקת הקריאייטיב.",
    recommendedActionType: "CREATE_NEW_VARIANT",
    recommendedAction: "צור גרסה נוספת של המודעה.",
    requiresApproval: true,
    status: "OPEN",
    aiGenerated: true,
    metricsSummary: { changes: { cplPct: 38 } },
    ...overrides,
  };
}

function health(
  status: CampaignHealth["healthStatus"],
  recommendation: AiCampaignRecommendation | null = null
): CampaignHealth {
  return {
    metaCampaignId: "120",
    healthStatus: status,
    metrics: { cpl: 27, ctr: 2.3, cpc: 1.4 },
    recommendation,
  };
}

function renderPanel(
  extra: Partial<React.ComponentProps<typeof MetaCampaignHealthPanel>> = {}
) {
  return render(
    <MemoryRouter>
      <div className="max-w-sm">
        <MetaCampaignHealthPanel
          businessId="biz-1"
          campaignId="120"
          currency="ILS"
          {...extra}
        />
      </div>
    </MemoryRouter>
  );
}

describe("MetaCampaignHealthPanel", () => {
  beforeEach(() => {
    localeRef.current = he;
    getMetaCampaignHealth.mockReset();
    listAiCampaignRecommendations.mockReset();
    dismissAiCampaignRecommendation.mockReset();
    viewAiCampaignRecommendation.mockReset();
    listAiCampaignRecommendations.mockResolvedValue([]);
    dismissAiCampaignRecommendation.mockResolvedValue(rec({ status: "DISMISSED" }));
    viewAiCampaignRecommendation.mockResolvedValue(rec({ status: "VIEWED" }));
  });

  it("renders the healthy state", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("HEALTHY"));
    renderPanel();
    await waitFor(() =>
      expect(screen.getByTestId("campaign-health-panel")).toHaveAttribute(
        "data-health-status",
        "HEALTHY"
      )
    );
    expect(screen.getByText("אין כרגע שינויים מומלצים.")).toBeInTheDocument();
  });

  it("renders the watch state", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("WATCH", rec({ severity: "OPPORTUNITY" })));
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(status === "open" ? [rec({ severity: "OPPORTUNITY" })] : [])
    );
    renderPanel();
    await waitFor(() =>
      expect(screen.getByTestId("campaign-health-panel")).toHaveAttribute(
        "data-health-status",
        "WATCH"
      )
    );
  });

  it("renders the recommendation state", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("ACTION_RECOMMENDED", rec()));
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(status === "open" ? [rec()] : [])
    );
    renderPanel();
    await waitFor(() =>
      expect(screen.getByText("צור גרסה חדשה עם AI")).toBeInTheDocument()
    );
    expect(screen.getByText(/38%/)).toBeInTheDocument();
  });

  it("renders the critical state", async () => {
    const critical = rec({ id: "rec-c", severity: "CRITICAL", title: "מודעה נדחתה" });
    getMetaCampaignHealth.mockResolvedValue(health("CRITICAL", critical));
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(status === "open" ? [critical] : [])
    );
    renderPanel();
    await waitFor(() =>
      expect(screen.getByTestId("campaign-health-panel")).toHaveAttribute(
        "data-health-status",
        "CRITICAL"
      )
    );
  });

  it("lists open and handled recommendations", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("ACTION_RECOMMENDED", rec()));
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(
        status === "open"
          ? [rec()]
          : [rec({ id: "rec-2", status: "DISMISSED", title: "טופל" })]
      )
    );
    renderPanel();
    await waitFor(() => expect(screen.getByText("המלצות פתוחות")).toBeInTheDocument());
    expect(screen.getByText("המלצות שטופלו")).toBeInTheDocument();
    expect(screen.getByText("טופל")).toBeInTheDocument();
  });

  it("opens a recommendation and can dismiss it", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("ACTION_RECOMMENDED", rec()));
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(status === "open" ? [rec()] : [])
    );
    renderPanel({ highlightRecommendationId: "rec-1" });
    await waitFor(() => expect(screen.getByText("לא עכשיו")).toBeInTheDocument());
    expect(viewAiCampaignRecommendation).toHaveBeenCalledWith("biz-1", "rec-1");
    fireEvent.click(screen.getByText("לא עכשיו"));
    await waitFor(() =>
      expect(dismissAiCampaignRecommendation).toHaveBeenCalledWith("biz-1", "rec-1")
    );
  });

  it("supports notification navigation highlight", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("ACTION_RECOMMENDED", rec()));
    listAiCampaignRecommendations.mockImplementation((_: string, status?: string) =>
      Promise.resolve(status === "open" ? [rec()] : [])
    );
    renderPanel({ highlightRecommendationId: "rec-1" });
    await waitFor(() =>
      expect(screen.getByTestId("recommendation-card-rec-1").className).toMatch(/violet/)
    );
  });

  it("shows health for a manual campaign id", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("HEALTHY"));
    renderPanel({ campaignId: "manual-99" });
    await waitFor(() =>
      expect(getMetaCampaignHealth).toHaveBeenCalledWith("biz-1", "manual-99")
    );
  });

  it("shows health for an AI campaign id", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("WATCH"));
    renderPanel({ campaignId: "ai-12" });
    await waitFor(() =>
      expect(getMetaCampaignHealth).toHaveBeenCalledWith("biz-1", "ai-12")
    );
  });

  it("renders loading and error states", async () => {
    getMetaCampaignHealth.mockRejectedValue(new Error("down"));
    renderPanel();
    expect(screen.getByText("טוען מצב קמפיין...")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("לא ניתן לטעון את מצב הקמפיין.")).toBeInTheDocument()
    );
  });

  it("renders the empty list state", async () => {
    listAiCampaignRecommendations.mockResolvedValue([]);
    renderPanel({ campaignId: undefined, variant: "list" });
    await waitFor(() =>
      expect(screen.getByText("אין עדיין המלצות ביצועים.")).toBeInTheDocument()
    );
  });

  it("renders English copy", async () => {
    localeRef.current = en;
    getMetaCampaignHealth.mockResolvedValue(health("HEALTHY"));
    renderPanel();
    await waitFor(() =>
      expect(screen.getByText("No recommended changes right now.")).toBeInTheDocument()
    );
  });

  it("fits a mobile-width container", async () => {
    getMetaCampaignHealth.mockResolvedValue(health("HEALTHY"));
    const { container } = renderPanel();
    await waitFor(() =>
      expect(screen.getByTestId("campaign-health-panel")).toBeInTheDocument()
    );
    expect(container.querySelector(".max-w-sm")).toBeTruthy();
  });
});
