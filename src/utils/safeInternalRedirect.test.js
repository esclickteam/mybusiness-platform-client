import { beforeEach, describe, expect, it } from "vitest";
import {
  alignRedirectBusinessId,
  clearPostLoginRedirect,
  consumePostLoginRedirect,
  peekPostLoginRedirect,
  rememberPostLoginRedirect,
  resolvePostLoginDestination,
  sanitizeInternalRedirect,
} from "./safeInternalRedirect";

const BIZ = "507f1f77bcf86cd799439011";

describe("sanitizeInternalRedirect", () => {
  it("accepts internal dashboard paths", () => {
    expect(
      sanitizeInternalRedirect(`/business/${BIZ}/dashboard/crm/leads`)
    ).toBe(`/business/${BIZ}/dashboard/crm/leads`);
    expect(
      sanitizeInternalRedirect(`/business/${BIZ}/dashboard/website/templates`)
    ).toBe(`/business/${BIZ}/dashboard/website/templates`);
    expect(
      sanitizeInternalRedirect(`/business/${BIZ}/dashboard/automations`)
    ).toBe(`/business/${BIZ}/dashboard/automations`);
    expect(
      sanitizeInternalRedirect(`/business/${BIZ}/dashboard/integrations`)
    ).toBe(`/business/${BIZ}/dashboard/integrations`);
    expect(
      sanitizeInternalRedirect(`/business/${BIZ}/dashboard/crm/work-hours`)
    ).toBe(`/business/${BIZ}/dashboard/crm/work-hours`);
    expect(sanitizeInternalRedirect(`/business/${BIZ}/dashboard`)).toBe(
      `/business/${BIZ}/dashboard`
    );
    expect(
      sanitizeInternalRedirect(`/business/${BIZ}/dashboard/website`)
    ).toBe(`/business/${BIZ}/dashboard/website`);
  });

  it("accepts encoded redirect values", () => {
    const encoded = encodeURIComponent(
      `/business/${BIZ}/dashboard/crm/leads`
    );
    expect(sanitizeInternalRedirect(encoded)).toBe(
      `/business/${BIZ}/dashboard/crm/leads`
    );
  });

  it("blocks external / protocol / malformed redirects", () => {
    expect(sanitizeInternalRedirect("https://evil.com")).toBeNull();
    expect(sanitizeInternalRedirect("//evil.com")).toBeNull();
    expect(sanitizeInternalRedirect("javascript:alert(1)")).toBeNull();
    expect(sanitizeInternalRedirect("data:text/html,hi")).toBeNull();
    expect(sanitizeInternalRedirect("https://bizuply.com/dashboard")).toBeNull();
    expect(sanitizeInternalRedirect("not-a-path")).toBeNull();
    expect(sanitizeInternalRedirect("")).toBeNull();
    expect(sanitizeInternalRedirect(null)).toBeNull();
  });
});

describe("resolvePostLoginDestination", () => {
  it("login without redirect → partner dashboard", () => {
    expect(resolvePostLoginDestination({ role: "partner" })).toBe(
      "/partner/dashboard"
    );
  });

  it("login without redirect → dashboard for full business", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
      })
    ).toBe(`/business/${BIZ}/dashboard`);
  });

  it("login with CRM redirect → CRM Leads", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: `/business/${BIZ}/dashboard/crm/leads`,
      })
    ).toBe(`/business/${BIZ}/dashboard/crm/leads`);
  });

  it("login with website redirect → Website", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: `/business/${BIZ}/dashboard/website`,
      })
    ).toBe(`/business/${BIZ}/dashboard/website`);
  });

  it("login with automations redirect → Automations", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: `/business/${BIZ}/dashboard/automations`,
      })
    ).toBe(`/business/${BIZ}/dashboard/automations`);
  });

  it("login with integrations redirect → Integrations", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: `/business/${BIZ}/dashboard/integrations`,
      })
    ).toBe(`/business/${BIZ}/dashboard/integrations`);
  });

  it("encoded redirect works", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: encodeURIComponent(
          `/business/${BIZ}/dashboard/website/templates`
        ),
      })
    ).toBe(`/business/${BIZ}/dashboard/website/templates`);
  });

  it("external redirect is blocked → dashboard fallback", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: "https://evil.example/phish",
      })
    ).toBe(`/business/${BIZ}/dashboard`);
  });

  it("malformed redirect → dashboard fallback", () => {
    expect(
      resolvePostLoginDestination({
        role: "business",
        businessId: BIZ,
        hasAccess: true,
        queryRedirect: "//////",
      })
    ).toBe(`/business/${BIZ}/dashboard`);
  });

  it("aligns foreign businessId in redirect to the authenticated business", () => {
    const other = "aaaaaaaaaaaaaaaaaaaaaaaa";
    expect(
      alignRedirectBusinessId(
        `/business/${other}/dashboard/crm/leads`,
        BIZ
      )
    ).toBe(`/business/${BIZ}/dashboard/crm/leads`);
  });

  it("preserves matching businessId", () => {
    expect(
      alignRedirectBusinessId(`/business/${BIZ}/dashboard/automations`, BIZ)
    ).toBe(`/business/${BIZ}/dashboard/automations`);
  });
});

describe("postLoginRedirect session helpers", () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearPostLoginRedirect();
  });

  it("remembers and consumes a safe redirect (already authenticated flow)", () => {
    expect(
      rememberPostLoginRedirect(`/business/${BIZ}/dashboard/integrations`)
    ).toBe(`/business/${BIZ}/dashboard/integrations`);
    expect(peekPostLoginRedirect()).toBe(
      `/business/${BIZ}/dashboard/integrations`
    );
    expect(consumePostLoginRedirect()).toBe(
      `/business/${BIZ}/dashboard/integrations`
    );
    expect(peekPostLoginRedirect()).toBeNull();
  });

  it("does not remember unsafe redirects", () => {
    expect(rememberPostLoginRedirect("//evil.com")).toBeNull();
    expect(peekPostLoginRedirect()).toBeNull();
  });

  it("maps all onboarding email CTA paths correctly", () => {
    const cases = [
      [`/business/${BIZ}/dashboard`, `/business/${BIZ}/dashboard`],
      [
        `/business/${BIZ}/dashboard/website/templates`,
        `/business/${BIZ}/dashboard/website/templates`,
      ],
      [
        `/business/${BIZ}/dashboard/crm/leads`,
        `/business/${BIZ}/dashboard/crm/leads`,
      ],
      [
        `/business/${BIZ}/dashboard/automations`,
        `/business/${BIZ}/dashboard/automations`,
      ],
      [
        `/business/${BIZ}/dashboard/crm/work-hours`,
        `/business/${BIZ}/dashboard/crm/work-hours`,
      ],
      [
        `/business/${BIZ}/dashboard/integrations`,
        `/business/${BIZ}/dashboard/integrations`,
      ],
      [
        `/business/${BIZ}/dashboard/website`,
        `/business/${BIZ}/dashboard/website`,
      ],
    ];
    for (const [input, expected] of cases) {
      expect(
        resolvePostLoginDestination({
          role: "business",
          businessId: BIZ,
          hasAccess: true,
          queryRedirect: input,
        })
      ).toBe(expected);
    }
  });
});
