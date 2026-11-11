import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PartnersRecruitment from "./PartnersRecruitment";

const i18nState = vi.hoisted(() => ({ language: "en" }));

vi.mock("react-helmet-async", () => ({
  Helmet: () => null,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: i18nState,
  }),
}));

vi.mock("../../lib/partnerApi", () => ({
  fetchPartnerPlans: vi.fn(async () => []),
}));

vi.mock("../../lib/privacyConsentClient", () => ({
  createConsentKey: () => "testconsentkey0001",
  storePrivacyConsent: vi.fn(async () => ({ status: "stored", id: "consent1" })),
}));

describe("bizuply.com/partners recruitment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18nState.language = "en";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: true, status: "open" }),
      }))
    );
  });

  it("links registration to the international plan and states the commercial terms", () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    const applyLink = screen.getByTestId("international-register-link");
    expect(applyLink).toHaveAttribute("href", "#apply");
    expect(screen.getByTestId("international-annual-register-link")).toHaveAttribute(
      "href",
      "/partner/register?planKey=partner_international&billing=annual"
    );
    expect(screen.getAllByText(/\$2,990/).length).toBeGreaterThan(0);
    expect(screen.getByTestId("international-monthly-price").textContent).toContain("$299");
    expect(screen.getByTestId("annual-best-value")).toHaveTextContent(/Best value/i);
    expect(screen.getByTestId("annual-savings").textContent).toContain("$598");
    expect(screen.getByTestId("international-monthly-link")).toHaveAttribute("href", "#apply");
    expect(screen.getByTestId("international-monthly-register-link")).toHaveAttribute(
      "href",
      "/partner/register?planKey=partner_international&billing=monthly"
    );
    expect(screen.getAllByText(/30%/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/10%/).length).toBeGreaterThan(0);
    expect(screen.getByText(/does not start a live charge/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The application is free/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not yet active/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/payment_due/)).not.toBeInTheDocument();
    expect(screen.getByTestId("monthly-price-card")).toHaveTextContent(/Partner Center/);
    expect(screen.getByTestId("monthly-price-card")).toHaveTextContent(/\$299/);
    expect(screen.getByTestId("tier-move")).toHaveTextContent("1–19 active paying customers");
    expect(screen.getByTestId("tier-move")).toHaveTextContent("30%");
    expect(screen.getByTestId("tier-move")).toHaveTextContent(/drops below a band/);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build Your Business with Bizuply",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("track-Business Partner")).toBeInTheDocument();
    expect(screen.getByTestId("compare-Affiliate")).toBeInTheDocument();
    expect(screen.getByTestId("compare-Business Partner")).toHaveTextContent(/\$299/);
    expect(screen.getByTestId("compare-Affiliate")).toHaveTextContent(/15%/);
    expect(screen.getByTestId("compare-Reseller")).toHaveTextContent(/agreement/i);
    expect(screen.getByTestId("partner-sticky-join")).toBeInTheDocument();
    expect(screen.getByTestId("product-meta-campaigns")).toBeInTheDocument();
    expect(screen.getByTestId("product-meta-campaigns").querySelector("a")).toHaveAttribute(
      "href",
      "/meta-campaigns"
    );
    expect(screen.getByTestId("product-meta-campaigns")).toHaveTextContent(/Lead Ads/i);
    expect(screen.getByTestId("product-meta-campaigns")).toHaveTextContent(/not on Meta ad spend/i);
    expect(screen.getByTestId("product-meta-campaigns").querySelector("video")).toBeNull();
    expect(screen.getByTestId("product-crm").querySelector("img")).toBeNull();
    expect(screen.getByTestId("product-whatsapp-api").querySelector("a")).toHaveAttribute("href", "/whatsapp-api");
    expect(screen.getByTestId("product-automations").querySelector("a")).toHaveAttribute("href", "/automations");
    expect(screen.getByTestId("product-website-builder").querySelector("a")).toHaveAttribute("href", "/website-builder");
    expect(screen.getByTestId("partners-recruitment").innerHTML).not.toContain("demo-media");
    expect(screen.getByText("Up to 40% Recurring Commission")).toBeInTheDocument();
    expect(document.querySelectorAll(".ipartner video")).toHaveLength(0);
    expect(screen.getByTestId("partner-tracks-table")).toHaveTextContent(/Reseller/i);
    expect(screen.getAllByText(/Illustration only/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Coming soon/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("saas-catalog")).toHaveTextContent("BeautyFlow");
    expect(screen.getByTestId("saas-catalog")).toHaveTextContent(/Beauty & wellness/i);
    expect(screen.getByTestId("saas-catalog").querySelector(".ip-badge")).toBeNull();
  });

  it("estimates commission from the published tiers including one-time deals", () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByTestId("calc-customers"), { target: { value: "20" } });
    fireEvent.change(screen.getByTestId("calc-price"), { target: { value: "100" } });
    fireEvent.change(screen.getByTestId("calc-onetime-count"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("calc-onetime-avg"), { target: { value: "500" } });
    expect(screen.getByTestId("calc-revenue")).toHaveTextContent("$2,000");
    expect(screen.getByTestId("calc-month")).toHaveTextContent("$700");
    expect(screen.getByTestId("calc-year")).toHaveTextContent("$8,400");
    expect(screen.getByTestId("calc-onetime")).toHaveTextContent("$100");
    expect(screen.getByTestId("calc-total")).toHaveTextContent("$8,500");
    expect(screen.getByTestId("calc-membership")).toHaveTextContent("$2,990");
    expect(screen.getByTestId("calc-balance")).toHaveTextContent("$5,410");
    expect(screen.getByTestId("calc-month")).toHaveTextContent("$700");
    fireEvent.click(screen.getByTestId("calc-billing-monthly"));
    expect(screen.getByTestId("calc-membership")).toHaveTextContent("$299");
    expect(screen.getByTestId("calc-balance")).toHaveTextContent("$4,812");
    expect(screen.getByTestId("calc-month")).toHaveTextContent("$700");
    expect(screen.getByTestId("calc-year")).toHaveTextContent("$8,400");
    expect(screen.getAllByText(/Simulation only/i).length).toBeGreaterThan(0);
  });

  it("shows Hebrew hero and Business Partner pricing", () => {
    i18nState.language = "he";
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "בנו את העסק שלכם עם Bizuply",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("international-monthly-price").textContent).toContain("$299");
    expect(screen.getByTestId("international-annual-price").textContent).toContain("$2,990");
    expect(screen.getByTestId("annual-savings").textContent).toContain("$598");
    expect(screen.getAllByText(/הגשת הבקשה ללא תשלום|ההגשה ללא תשלום/).length).toBeGreaterThan(0);
    expect(screen.getByText(/החברות עדיין אינה פעילה/)).toBeInTheDocument();
    expect(screen.queryByText(/payment_due/)).not.toBeInTheDocument();
    expect(screen.getByTestId("monthly-price-card")).toHaveTextContent(/מרכז השותפים/);
    expect(screen.getByTestId("tier-move")).toHaveTextContent("עד 19 לקוחות משלמים פעילים");
    expect(screen.getByTestId("tier-move")).toHaveTextContent("30%");
    expect(screen.getByTestId("compare-Reseller")).toHaveTextContent(/לא מדרגות העמלה שלמעלה/);
    expect(screen.getByTestId("compare-Affiliate")).toHaveTextContent(/15%/);
    expect(screen.getByTestId("product-meta-campaigns")).toHaveTextContent(/קמפיינים במטא/);
    expect(screen.getByTestId("product-meta-campaigns").querySelector("a")).toHaveAttribute(
      "href",
      "/meta-campaigns"
    );
    expect(screen.getByTestId("product-crm").querySelector("img")).toBeNull();
    expect(screen.getByText("עד 40% עמלה חוזרת")).toBeInTheDocument();
    expect(screen.queryByText("בקרוב")).not.toBeInTheDocument();
    expect(screen.getByTestId("saas-catalog")).toHaveTextContent("יופי וטיפוח");
    expect(screen.getByTestId("saas-catalog").querySelector(".ip-badge")).toBeNull();
    expect(screen.getByTestId("partners-recruitment").textContent || "").not.toMatch(/דמו/);
    expect(document.querySelectorAll(".ipartner video")).toHaveLength(0);
    expect(screen.getByTestId("partner-tracks-table")).toHaveTextContent(/Reseller/);
    expect(screen.getAllByText(/המחשה בלבד/).length).toBeGreaterThan(0);
  });

  it("validates required fields and privacy before calling the API", async () => {
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("partner-apply-submit"));
    expect(await screen.findAllByText(/Required/i)).not.toHaveLength(0);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("saves the application form only after a successful backend response", async () => {
    const { storePrivacyConsent } = await import("../../lib/privacyConsentClient");
    render(
      <MemoryRouter>
        <PartnersRecruitment />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/^Full name/i), { target: { value: "Dana Levi" } });
    fireEvent.change(screen.getByLabelText(/Company name/i), { target: { value: "Northwind" } });
    fireEvent.change(screen.getByLabelText(/Business email/i), { target: { value: "dana@northwind.example" } });
    fireEvent.change(screen.getByLabelText(/^Phone/i), { target: { value: "+972501234567" } });
    fireEvent.change(screen.getByLabelText(/^Country/i), { target: { value: "Israel" } });
    fireEvent.change(screen.getByLabelText(/Field of activity/i), { target: { value: "Marketing" } });
    fireEvent.change(screen.getByLabelText(/Prior sales or partnership experience/i), {
      target: { value: "Five years selling CRM." },
    });
    fireEvent.change(screen.getByLabelText(/Additional message/i), {
      target: { value: "We sell CRM services to local businesses." },
    });
    fireEvent.click(
      screen.getByLabelText(/I have read the Privacy Policy/i)
    );
    fireEvent.click(screen.getByTestId("partner-apply-submit"));
    await waitFor(() => {
      expect(screen.getByTestId("partner-apply-success")).toBeInTheDocument();
    });
    expect(storePrivacyConsent).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/support\/partner-application$/),
      expect.objectContaining({
        method: "POST",
      })
    );
    const body = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(body.privacyAccepted).toBe(true);
    expect(body.consentKey).toBe("testconsentkey0001");
    expect(body.phone).toBe("+972501234567");
    expect(body.partnershipType).toBe("Business Partner");
    expect(body.message).toContain("We sell CRM services to local businesses.");
    expect(body.message).toContain("Field of activity: Marketing");
    expect(body.message).toContain("Prior sales or partnership experience: Five years selling CRM.");
    expect(body.activity).toBeUndefined();
    expect(body.experience).toBeUndefined();
    expect(body.dialCode).toBeUndefined();
  });
});
