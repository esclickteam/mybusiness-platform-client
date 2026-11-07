import { describe, expect, it } from "vitest";

import {
  buildAttentionItems,
  resolveDashboardSurfaces,
  seriesHasActivity,
  summarizeMessageSample,
  summarizeWhatsAppCampaigns,
} from "./dashboardVisibility";

const crmOnly = {
  crm: { enabled: true, includedInPlan: true },
  leads: { enabled: true, includedInPlan: true },
};

const whatsappOnly = {
  whatsapp: { enabled: true, includedInPlan: true },
  whatsappApi: { enabled: true, includedInPlan: true },
};

describe("resolveDashboardSurfaces", () => {
  it("shows CRM work and hides WhatsApp for a CRM-only account", () => {
    const surfaces = resolveDashboardSurfaces({
      enabledModules: ["dashboard", "crm"],
      entitlements: crmOnly,
      whatsappInNav: false,
      metaInNav: false,
    });

    expect(surfaces.leads).toBe(true);
    expect(surfaces.appointments).toBe(false);
    expect(surfaces.whatsapp).toBe(false);
    expect(surfaces.metaCampaigns).toBe(false);
    expect(surfaces.website).toBe(false);
  });

  it("shows WhatsApp and hides CRM for a WhatsApp-only account", () => {
    const surfaces = resolveDashboardSurfaces({
      enabledModules: ["dashboard", "whatsapp"],
      entitlements: whatsappOnly,
      whatsappInNav: true,
      metaInNav: false,
    });

    expect(surfaces.whatsapp).toBe(true);
    expect(surfaces.leads).toBe(false);
    expect(surfaces.appointments).toBe(false);
    expect(surfaces.website).toBe(false);
  });

  it("hides a revoked module even when the module list still names it", () => {
    const surfaces = resolveDashboardSurfaces({
      enabledModules: ["dashboard", "crm", "whatsapp"],
      entitlements: {
        crm: { enabled: false, status: "expired", includedInPlan: true },
        leads: { enabled: false, status: "expired", includedInPlan: true },
        whatsapp: { enabled: false, status: "suspended", includedInPlan: true },
      },
      whatsappInNav: true,
      metaInNav: false,
    });

    expect(surfaces.leads).toBe(false);
    expect(surfaces.whatsapp).toBe(false);
  });

  it("keeps legacy accounts with no entitlement record on their module list", () => {
    const surfaces = resolveDashboardSurfaces({
      enabledModules: null,
      entitlements: null,
      whatsappInNav: false,
      metaInNav: false,
    });

    expect(surfaces.leads).toBe(true);
    expect(surfaces.appointments).toBe(true);
    expect(surfaces.whatsapp).toBe(false);
  });
});

describe("dashboard read helpers", () => {
  it("does not treat an empty series as activity", () => {
    expect(seriesHasActivity([{ value: 0 }, { value: 0 }])).toBe(false);
    expect(seriesHasActivity([{ value: 0 }, { value: 2 }])).toBe(true);
  });

  it("counts stored campaign statuses without inventing a running total", () => {
    const summary = summarizeWhatsAppCampaigns(
      [
        { status: "sending", stats: { failed: 1 } },
        { status: "completed", stats: { failed: 0 } },
        { status: "draft", scheduledAt: "2099-01-01T00:00:00.000Z" },
        { status: "failed" },
      ],
      Date.parse("2026-11-07T00:00:00.000Z")
    );

    expect(summary.byStatus).toEqual({
      sending: 1,
      completed: 1,
      draft: 1,
      failed: 1,
    });
    expect(summary.scheduled).toBe(1);
    expect(summary.failedRecipients).toBe(1);
  });

  it("counts a message sample separately from period totals", () => {
    expect(
      summarizeMessageSample([
        { direction: "inbound", status: "received" },
        { direction: "outbound", status: "delivered" },
        { direction: "outbound", status: "read" },
        { direction: "outbound", status: "failed" },
      ])
    ).toEqual({
      total: 4,
      inbound: 1,
      outbound: 3,
      delivered: 1,
      read: 1,
      failed: 1,
    });
  });

  it("builds attention only from positive stored signals", () => {
    expect(
      buildAttentionItems({
        showLeads: true,
        untreatedLeads: 0,
        showAppointments: true,
        upcomingAppointments: 0,
        showWhatsapp: true,
        whatsappLoaded: true,
        whatsappConnected: true,
        failedMessages: 0,
        failedCampaigns: 0,
        leadsHref: "/leads",
        appointmentsHref: "/appointments",
        whatsappHref: "/whatsapp",
        connectionHref: "/connect",
      })
    ).toEqual([]);

    expect(
      buildAttentionItems({
        showLeads: false,
        untreatedLeads: 4,
        showAppointments: false,
        upcomingAppointments: 2,
        showWhatsapp: true,
        whatsappLoaded: false,
        whatsappConnected: null,
        failedMessages: 3,
        failedCampaigns: 0,
        leadsHref: "/leads",
        appointmentsHref: "/appointments",
        whatsappHref: "/whatsapp",
        connectionHref: "/connect",
      }).map((item) => item.id)
    ).toEqual(["wa-failed"]);
  });
});
