import { fireEvent, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SaasMarketplacePage from "./SaasMarketplacePage";

vi.mock("../../saas/api", () => ({
  fetchMarketplace: vi.fn(),
}));

import { fetchMarketplace } from "../../saas/api";
import i18n from "../../i18n/i18n";

const products = [
  {
    id: "1",
    name: "ServiceFlow",
    slug: "serviceflow",
    category: "home_services",
    categoryLabel: "Home Services",
    headline: "Complete Field Service Management SaaS",
    subtitle: "Launch your own SaaS for home service businesses.",
    shortDescription: "For plumbers and electricians.",
    fullDescription: "A ready platform.",
    priceUsd: 14900,
    estimatedDevCostLabel: "$50,000+",
    accent: "#4F46E5",
    accentSecondary: "#38BDF8",
    screenshots: [],
    features: [],
    included: [],
    demoUrl: "https://example.com/serviceflow-demo",
    status: "published",
    badge: "Ready to launch",
    seoTitle: "Field Service SaaS for Sale | Ready-to-Launch Platform | Bizuply",
    seoDescription: "Launch your own field service SaaS.",
    whatsappBlurb: "the ready-to-launch Field Service SaaS platform",
    whatsappMessage: "Hi",
    purchasable: true,
  },
  {
    id: "2",
    name: "SalonFlow",
    slug: "salonflow",
    category: "beauty_wellness",
    categoryLabel: "Beauty & Wellness",
    headline: "Beauty & Wellness Management SaaS",
    subtitle: "Launch your own SaaS for salons.",
    shortDescription: "Appointments and booking.",
    fullDescription: "A ready platform.",
    priceUsd: 12900,
    estimatedDevCostLabel: "$40,000+",
    accent: "#C026D3",
    accentSecondary: "#FB7185",
    screenshots: [],
    features: [],
    included: [],
    demoUrl: "",
    status: "published",
    badge: "Booking ready",
    seoTitle: "Salon",
    seoDescription: "Salon",
    whatsappBlurb: "",
    whatsappMessage: "Hi",
    purchasable: true,
  },
  {
    id: "3",
    name: "Northwind Desk",
    slug: "northwind-desk",
    category: "real_estate",
    categoryLabel: "Real Estate",
    headline: "Northwind Desk",
    subtitle: "Listings and owners.",
    shortDescription: "Listings, owners, and inquiries in one white-label product.",
    fullDescription: "Listings, owners, and inquiries in one white-label product.",
    priceUsd: 0,
    estimatedDevCostLabel: "",
    accent: "#0F766E",
    accentSecondary: "#38BDF8",
    screenshots: [],
    features: [],
    included: [],
    demoUrl: "",
    status: "ACTIVE",
    badge: "",
    seoTitle: "Northwind Desk",
    seoDescription: "Listings and owners.",
    whatsappBlurb: "",
    whatsappMessage: "Hi",
    purchasable: false,
    kind: "template",
    interactiveDemoEnabled: true,
    supportsAdminDemo: true,
    supportsCustomerDemo: false,
    demoSelectorUrl: "https://example.com/explore",
    adminDemoUrl: "https://example.com/admin",
    customerDemoUrl: "https://example.com/customer",
    whiteLabel: true,
    partnerModel: false,
    exclusiveCountry: true,
  },
];

function named(expected: string) {
  return (value: string) => value.replace(/[\u200E\u200F\u2066-\u2069]/g, "") === expected;
}

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/saas"]}>
        <SaasMarketplacePage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("SaaS marketplace page", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
    vi.mocked(fetchMarketplace).mockResolvedValue({
      success: true,
      categories: [],
      settings: {
        whatsappE164: "",
        usdToIlsRate: 3.7,
        checkoutCurrency: "ILS",
        listCurrency: "USD",
      },
      products,
    });
  });

  it("shows the hero and filters platforms", async () => {
    renderPage();
    expect(
      await screen.findByRole("heading", { name: named("Launch Your Own SaaS Business") })
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: named("Choose How You Want to Launch") })).toBeTruthy();
    expect(screen.getByRole("heading", { name: named("What is SaaS?") })).toBeTruthy();
    expect(screen.getAllByText("Illustrative example only. Revenue is not guaranteed.").length).toBeGreaterThan(0);
    expect(document.body.textContent || "").not.toMatch(/Buy Now/i);
    expect(screen.getByRole("heading", { name: "ServiceFlow" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "SalonFlow" })).toBeTruthy();
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe(
      "noindex, follow"
    );

    fireEvent.click(screen.getByRole("button", { name: "Beauty & Wellness" }));
    expect(screen.queryByRole("heading", { name: "ServiceFlow" })).toBeNull();
    expect(screen.getByRole("heading", { name: "SalonFlow" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "All Systems" }));
    expect(screen.getByRole("heading", { name: "ServiceFlow" })).toBeTruthy();
  });

  it("opens a template demo from the published demo fields", async () => {
    renderPage();
    const heading = await screen.findByRole("heading", { name: "Northwind Desk" });
    const row = heading.closest("article");
    expect(row).toBeTruthy();
    const card = within(row as HTMLElement);
    expect(card.getByRole("link", { name: "To the system" }).getAttribute("href")).toBe("/saas/northwind-desk");
    expect(card.getByText(named("Interactive Demo"))).toBeTruthy();
    expect(card.getByText(named("White Label"))).toBeTruthy();
    expect(card.queryByText(named("Partner Model Available"))).toBeNull();
    expect(card.getByText(named("Country Exclusivity Possible"))).toBeTruthy();
    fireEvent.click(card.getByRole("button", { name: "Watch the demo" }));
    expect(screen.getByRole("heading", { name: named("Explore Northwind Desk") })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Admin / Owner Demo" }).getAttribute("href")).toBe(
      "https://example.com/admin"
    );
    expect(screen.queryByRole("link", { name: "Customer Demo" })).toBeNull();
    expect(screen.getByRole("link", { name: "Explore Full Demo" }).getAttribute("href")).toBe(
      "https://example.com/explore"
    );
  });

  it("does not present fake traction", async () => {
    renderPage();
    await screen.findByRole("heading", { name: "ServiceFlow" });
    const text = document.body.textContent || "";
    expect(text).not.toMatch(/existing customers/i);
    expect(text).not.toMatch(/active subscribers/i);
    expect(text).not.toMatch(/\bARR\b/);
    expect(text).not.toMatch(/profitable/i);
  });

  it("keeps the Hebrew SaaS question readable", async () => {
    await i18n.changeLanguage("he");
    renderPage();
    const heading = await screen.findByRole("heading", { name: named("מה זה SaaS?") });
    expect(heading.textContent?.replace(/[\u200E\u200F\u2066\u2069]/g, "")).toBe("מה זה SaaS?");
    expect(heading.textContent).toContain("\u2066SaaS\u2069");
    expect(document.querySelector(".saas-market")?.getAttribute("dir")).toBe("rtl");
  });
});
