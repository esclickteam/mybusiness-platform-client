import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const ALLOWED_BUSINESS_ID = "6a452720016d081ad1d6e328";
/** bdika — private WhatsApp connect allowlisted alongside Managed mode. */
const BDIKA_BUSINESS_ID = "6a1c7b9c17abeea4a444f6fa";
/** The owning user's _id, which is deliberately NOT the allowlist key. */
const ALLOWED_BUSINESS_OWNER_USER_ID = "6a452720016d081ad1d6e325";
const OTHER_BUSINESS_ID = "6600000000000000000000ff";
const FUTURE_BUSINESS_ID = "77aaaaaaaaaaaaaaaaaaaaaa";

const mockUser = vi.fn();

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser() }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "he" },
  }),
}));

afterEach(() => {
  cleanup();
  vi.resetModules();
});

async function renderNav({
  user,
  urlBusinessId,
}: {
  user: Record<string, unknown> | null;
  urlBusinessId: string;
}) {
  mockUser.mockReturnValue(user);
  const { default: BusinessWorkspaceNav } = await import(
    "./BusinessWorkspaceNav"
  );

  render(
    <MemoryRouter initialEntries={[`/business/${urlBusinessId}/dashboard`]}>
      <Routes>
        <Route
          path="/business/:businessId/*"
          element={<BusinessWorkspaceNav />}
        />
      </Routes>
    </MemoryRouter>
  );
}

const navLink = (businessId: string, segment: string) =>
  document.querySelector(
    `a[href="/business/${businessId}/dashboard/${segment}"]`
  );

const whatsappLink = (businessId: string) => navLink(businessId, "whatsapp");

const metaCampaignsLink = (businessId: string) =>
  navLink(businessId, "meta-campaigns");

describe("BusinessWorkspaceNav restricted nav allowlist", () => {
  it("shows both restricted entries for the allowed business", async () => {
    await renderNav({
      user: { businessId: ALLOWED_BUSINESS_ID, role: "business" },
      urlBusinessId: ALLOWED_BUSINESS_ID,
    });

    expect(whatsappLink(ALLOWED_BUSINESS_ID)).not.toBeNull();
    expect(metaCampaignsLink(ALLOWED_BUSINESS_ID)).not.toBeNull();
  });

  it("shows WhatsApp for bdika so private Embedded Signup is reachable", async () => {
    await renderNav({
      user: { businessId: BDIKA_BUSINESS_ID, role: "business" },
      urlBusinessId: BDIKA_BUSINESS_ID,
    });

    expect(whatsappLink(BDIKA_BUSINESS_ID)).not.toBeNull();
    expect(metaCampaignsLink(BDIKA_BUSINESS_ID)).not.toBeNull();
  });

  it("hides both restricted entries for any other business", async () => {
    await renderNav({
      user: { businessId: OTHER_BUSINESS_ID, role: "business" },
      urlBusinessId: OTHER_BUSINESS_ID,
    });

    expect(whatsappLink(OTHER_BUSINESS_ID)).toBeNull();
    expect(metaCampaignsLink(OTHER_BUSINESS_ID)).toBeNull();
  });

  it("hides both entries by default for a newly created business", async () => {
    await renderNav({
      user: { businessId: FUTURE_BUSINESS_ID, role: "business" },
      urlBusinessId: FUTURE_BUSINESS_ID,
    });

    expect(whatsappLink(FUTURE_BUSINESS_ID)).toBeNull();
    expect(metaCampaignsLink(FUTURE_BUSINESS_ID)).toBeNull();
  });

  it("does not match on the owning user's _id, only the business _id", async () => {
    await renderNav({
      user: {
        businessId: ALLOWED_BUSINESS_OWNER_USER_ID,
        role: "business",
      },
      urlBusinessId: ALLOWED_BUSINESS_OWNER_USER_ID,
    });

    expect(whatsappLink(ALLOWED_BUSINESS_OWNER_USER_ID)).toBeNull();
    expect(metaCampaignsLink(ALLOWED_BUSINESS_OWNER_USER_ID)).toBeNull();
  });

  it("hides both entries when the business cannot be resolved", async () => {
    await renderNav({ user: { role: "business" }, urlBusinessId: "" });

    expect(document.querySelector('a[href$="/dashboard/whatsapp"]')).toBeNull();
    expect(
      document.querySelector('a[href$="/dashboard/meta-campaigns"]')
    ).toBeNull();
  });

  it("does not let another business reveal either entry via the URL", async () => {
    await renderNav({
      user: { businessId: OTHER_BUSINESS_ID, role: "business" },
      urlBusinessId: ALLOWED_BUSINESS_ID,
    });

    expect(whatsappLink(ALLOWED_BUSINESS_ID)).toBeNull();
    expect(metaCampaignsLink(ALLOWED_BUSINESS_ID)).toBeNull();
  });

  it("shows both entries for an admin viewing the allowed business", async () => {
    await renderNav({
      user: { role: "admin" },
      urlBusinessId: ALLOWED_BUSINESS_ID,
    });

    expect(whatsappLink(ALLOWED_BUSINESS_ID)).not.toBeNull();
    expect(metaCampaignsLink(ALLOWED_BUSINESS_ID)).not.toBeNull();
  });

  it("hides both entries for an admin viewing another business", async () => {
    await renderNav({
      user: { role: "admin" },
      urlBusinessId: OTHER_BUSINESS_ID,
    });

    expect(whatsappLink(OTHER_BUSINESS_ID)).toBeNull();
    expect(metaCampaignsLink(OTHER_BUSINESS_ID)).toBeNull();
  });

  it("leaves unrelated nav entries untouched for a non-allowed business", async () => {
    await renderNav({
      user: { businessId: OTHER_BUSINESS_ID, role: "business" },
      urlBusinessId: OTHER_BUSINESS_ID,
    });

    expect(navLink(OTHER_BUSINESS_ID, "crm")).not.toBeNull();
    expect(navLink(OTHER_BUSINESS_ID, "automations")).not.toBeNull();
    expect(navLink(OTHER_BUSINESS_ID, "billing")).not.toBeNull();
    expect(navLink(OTHER_BUSINESS_ID, "website")).not.toBeNull();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(5);
  });

  it("still respects module ACL for the allowed business", async () => {
    await renderNav({
      user: { businessId: ALLOWED_BUSINESS_ID, enabledModules: ["crm"] },
      urlBusinessId: ALLOWED_BUSINESS_ID,
    });

    expect(whatsappLink(ALLOWED_BUSINESS_ID)).toBeNull();
    expect(metaCampaignsLink(ALLOWED_BUSINESS_ID)).toBeNull();
    expect(navLink(ALLOWED_BUSINESS_ID, "crm")).not.toBeNull();
  });
});
