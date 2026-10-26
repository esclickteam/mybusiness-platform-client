import React from "react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { extraWhatsAppHubSegments } from "./hubNavigation";
import { INVISTIMO_BUSINESS_ID } from "../../../../utils/invistimoAdmin";

const authState = { businessId: "biz-other" };

vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { businessId: authState.businessId } }),
}));

import WhatsAppInvistimoOnly from "./WhatsAppInvistimoOnly";

function renderGuard(businessId: string) {
  authState.businessId = businessId;
  return render(
    <MemoryRouter initialEntries={["/whatsapp/automations"]}>
      <Routes>
        <Route
          path="/whatsapp"
          element={<Outlet context={{ businessId }} />}
        >
          <Route
            path="automations"
            element={
              <WhatsAppInvistimoOnly>
                <div data-testid="invistimo-only">ok</div>
              </WhatsAppInvistimoOnly>
            }
          />
          <Route
            path="overview"
            element={<div data-testid="overview">overview</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Invistimo-only WhatsApp extras isolation", () => {
  it("does not advertise extra segments to other tenants", () => {
    expect(extraWhatsAppHubSegments(false)).toEqual([]);
    expect(extraWhatsAppHubSegments(true).sort()).toEqual([
      "agents",
      "automations",
      "contacts",
      "scheduled",
    ]);
  });

  it("redirects other tenants away from extra screens", () => {
    renderGuard("biz-other");
    expect(screen.getByTestId("overview")).toBeInTheDocument();
    expect(screen.queryByTestId("invistimo-only")).not.toBeInTheDocument();
  });

  it("renders extra screens for the existing Invistimo businessId", () => {
    renderGuard(INVISTIMO_BUSINESS_ID);
    expect(screen.getByTestId("invistimo-only")).toBeInTheDocument();
    expect(screen.queryByTestId("overview")).not.toBeInTheDocument();
  });
});
