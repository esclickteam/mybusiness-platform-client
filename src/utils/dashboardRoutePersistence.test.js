import { afterEach, describe, expect, it } from "vitest";
import {
  automationsListRoute,
  clearLastDashboardRoute,
  getLastDashboardRoute,
  saveLastDashboardRoute,
} from "./dashboardRoutePersistence";

const BUSINESS_ID = "biz-route";
const BASE = `/business/${BUSINESS_ID}/dashboard`;

afterEach(() => {
  clearLastDashboardRoute(BUSINESS_ID);
});

describe("automations menu route restoration", () => {
  it("keeps the automations list and section tabs", () => {
    expect(automationsListRoute(`${BASE}/automations`)).toBe(`${BASE}/automations`);
    expect(automationsListRoute(`${BASE}/automations/templates?focus=ai`)).toBe(
      `${BASE}/automations/templates?focus=ai`
    );
    expect(automationsListRoute(`${BASE}/automations/runs`)).toBe(`${BASE}/automations/runs`);
  });

  it("does not restore an open automation editor", () => {
    expect(automationsListRoute(`${BASE}/automations/wf-123?configureAi=1`)).toBe(
      `${BASE}/automations`
    );
  });

  it("stores the list when the current screen is an editor", () => {
    saveLastDashboardRoute(BUSINESS_ID, `${BASE}/automations/wf-123`, "?configureAi=1");
    expect(getLastDashboardRoute(BUSINESS_ID)).toBe(`${BASE}/automations`);
  });

  it("still restores a non-automation dashboard page", () => {
    saveLastDashboardRoute(BUSINESS_ID, `${BASE}/crm/leads`, "");
    expect(getLastDashboardRoute(BUSINESS_ID)).toBe(`${BASE}/crm/leads`);
  });
});
