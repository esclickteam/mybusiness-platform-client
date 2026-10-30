import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PartnerRegister from "./PartnerRegister";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
    i18n: { language: "en" },
  }),
}));

vi.mock("../../components/auth/AuthShell", () => ({
  __esModule: true,
  default: ({ children }: { children: unknown }) => <div>{children}</div>,
  AuthCard: ({ title, subtitle, children }: { title: string; subtitle: string; children: unknown }) => (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

vi.mock("../../lib/partnerApi", () => ({
  fetchPartnerPlans: vi.fn(async () => [
    {
      planKey: "partner_basic",
      nameHe: "Partner",
      nameEn: "Partner",
      setupIls: 249,
      monthlyIls: 149,
      partnerMarkupShare: 0.75,
      additionalTeamUsers: 0,
      commissionModel: "markup_share",
    },
    {
      planKey: "partner_pro",
      nameHe: "Partner Pro",
      nameEn: "Partner Pro",
      setupIls: 399,
      monthlyIls: 249,
      partnerMarkupShare: 0.85,
      additionalTeamUsers: 3,
      commissionModel: "markup_share",
    },
  ]),
  registerPartner: vi.fn(),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/partner/register" element={<PartnerRegister />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PartnerRegister international lock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps legacy radios on the generic register URL", async () => {
    renderAt("/partner/register");
    expect(await screen.findByText(/partner.planNames.partner_pro/)).toBeInTheDocument();
    expect(screen.queryByText(/partner.planNames.partner_international/)).not.toBeInTheDocument();
  });

  it("locks partner_international and hides legacy radios", async () => {
    renderAt("/partner/register?planKey=partner_international");
    expect(await screen.findByText(/partner.planNames.partner_international/)).toBeInTheDocument();
    expect(screen.queryByText(/partner.planNames.partner_pro/)).not.toBeInTheDocument();
    expect(screen.queryByText(/partner.planNames.partner_basic/)).not.toBeInTheDocument();
    expect(screen.queryByText(/partner.planNames.partner_premium/)).not.toBeInTheDocument();
    expect(screen.queryByText(/partner.planNames.partner_percent/)).not.toBeInTheDocument();
    expect(screen.queryByText(/stagingOnly|Stripe/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("international-plan-only")).toBeInTheDocument();
    expect(screen.getByTestId("international-annual-price").textContent).toContain("5,000");
    expect(screen.getByText(/partner.register.internationalManual/)).toBeInTheDocument();
    expect(screen.getByText(/partner.register.internationalLocked/)).toBeInTheDocument();
  });
});
