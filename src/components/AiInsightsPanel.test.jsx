import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import AiInsightsPanel from "./AiInsightsPanel";

const navigateMock = vi.fn();
const apiPostMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../hooks/useLocaleDir", () => ({
  useLocaleDir: () => "rtl",
}));

vi.mock("@/api", () => ({
  default: {
    post: (...args) => apiPostMock(...args),
    get: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, opts = {}) => {
      if (typeof opts === "string") return opts;
      if (key === "aiInsights.cards.missing_seo.description") {
        return `לאתר "${opts.name ?? ""}" חסרות הגדרות SEO — כותרת, תיאור או תמונה לשיתוף.`;
      }
      if (key === "aiInsights.cards.missing_seo.title") {
        return opts.defaultValue || "השלימו הגדרות SEO";
      }
      if (key === "aiInsights.cards.missing_seo.actionLabel") {
        return opts.defaultValue || "עריכת SEO";
      }
      if (key === "aiInsights.cards.untreated_leads.title") {
        return opts.defaultValue || "יש לידים שלא טופלו";
      }
      if (key === "aiInsights.cards.untreated_leads.description") {
        return opts.defaultValue || "לידים חדשים ממתינים ב-CRM";
      }
      if (key === "aiInsights.cards.untreated_leads.actionLabel") {
        return opts.defaultValue || "צפייה בלידים";
      }
      if (key === "aiInsights.priorityUrgent") return "דחוף";
      if (key === "aiInsights.priorityRecommended") return "מומלץ";
      if (key === "aiInsights.actionCount") return `${opts.count || 0} פעולות`;
      if (key === "aiInsights.title") return "המלצות חכמות";
      if (key === "aiInsights.dismissAria") return "סגור";
      if (key === "aiInsights.panelAria") return "המלצות";
      return opts.defaultValue || key;
    },
  }),
}));

const BUSINESS_ID = "6a79c2ab99b8637bc15a4573";

function renderPanel(insights) {
  return render(
    <MemoryRouter>
      <AiInsightsPanel
        insights={insights}
        loading={false}
        businessId={BUSINESS_ID}
      />
    </MemoryRouter>
  );
}

describe("AiInsightsPanel regressions", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    apiPostMock.mockReset();
    apiPostMock.mockResolvedValue({ data: { success: true } });
  });

  it("shows real site name for missing_seo (not empty quotes)", () => {
    renderPanel([
      {
        id: "missing_seo",
        type: "seo",
        title: "השלימו הגדרות SEO",
        description:
          'לאתר "Launch Gate Site" חסרות הגדרות SEO — כותרת, תיאור או תמונה לשיתוף.',
        actionLabel: "עריכת SEO",
        priority: "medium",
        meta: {
          siteId: "6a79c37d8cd17b33b0728fdd",
          siteName: "Launch Gate Site",
          templateKey: "ido",
          stateHash: "missing_seo_6a79c37d8cd17b33b0728fdd",
        },
      },
    ]);

    expect(screen.getByText("השלימו הגדרות SEO")).toBeInTheDocument();
    expect(
      screen.getByText(/לאתר "Launch Gate Site" חסרות הגדרות SEO/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/לאתר ""/)).not.toBeInTheDocument();
  });

  it("falls back to server description when meta.siteName is missing", () => {
    renderPanel([
      {
        id: "missing_seo",
        type: "seo",
        title: "השלימו הגדרות SEO",
        description:
          'לאתר "Launch Gate Site" חסרות הגדרות SEO — כותרת, תיאור או תמונה לשיתוף.',
        actionLabel: "עריכת SEO",
        priority: "medium",
        meta: {
          siteId: "6a79c37d8cd17b33b0728fdd",
          stateHash: "missing_seo_6a79c37d8cd17b33b0728fdd",
        },
      },
    ]);

    expect(
      screen.getByText(/לאתר "Launch Gate Site" חסרות הגדרות SEO/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/לאתר ""/)).not.toBeInTheDocument();
  });

  it("CTA navigates without dismissing", async () => {
    renderPanel([
      {
        id: "untreated_leads",
        type: "leads",
        title: "יש לידים שלא טופלו",
        description: "לידים חדשים ממתינים ב-CRM",
        actionLabel: "צפייה בלידים",
        priority: "high",
        metric: { value: 2, label: "לידים חדשים" },
        meta: { stateHash: "new_leads_2" },
      },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "צפייה בלידים" }));

    expect(navigateMock).toHaveBeenCalledWith(
      `/business/${BUSINESS_ID}/dashboard/crm/leads`
    );
    expect(apiPostMock).not.toHaveBeenCalled();
    expect(screen.getByText("יש לידים שלא טופלו")).toBeInTheDocument();
  });

  it("X dismisses and posts dismiss with stateHash", async () => {
    renderPanel([
      {
        id: "untreated_leads",
        type: "leads",
        title: "יש לידים שלא טופלו",
        description: "לידים חדשים ממתינים ב-CRM",
        actionLabel: "צפייה בלידים",
        priority: "high",
        meta: { stateHash: "new_leads_2" },
      },
    ]);

    fireEvent.click(screen.getByLabelText("סגור"));

    await waitFor(() => {
      expect(apiPostMock).toHaveBeenCalledWith("/ai/insights/dismiss", {
        businessId: BUSINESS_ID,
        insightId: "untreated_leads",
        stateHash: "new_leads_2",
      });
    });

    expect(screen.queryByText("יש לידים שלא טופלו")).not.toBeInTheDocument();
  });

  it("keeps high priority before medium and does not duplicate ids", () => {
    renderPanel([
      {
        id: "missing_seo",
        type: "seo",
        title: "השלימו הגדרות SEO",
        description: 'לאתר "Launch Gate Site" חסרות',
        actionLabel: "עריכת SEO",
        priority: "medium",
        meta: { siteName: "Launch Gate Site", siteId: "abc" },
      },
      {
        id: "untreated_leads",
        type: "leads",
        title: "יש לידים שלא טופלו",
        description: "לידים חדשים",
        actionLabel: "צפייה בלידים",
        priority: "high",
        meta: { stateHash: "new_leads_1" },
      },
    ]);

    const titles = screen.getAllByRole("heading", { level: 4 }).map((el) =>
      el.textContent
    );
    expect(titles[0]).toBe("יש לידים שלא טופלו");
    expect(titles[1]).toBe("השלימו הגדרות SEO");
    expect(titles.filter((t) => t === "יש לידים שלא טופלו")).toHaveLength(1);
  });
});
