import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InvistimoCutoverReadinessPanel from "./InvistimoCutoverReadinessPanel";

vi.mock("../../../../api/whatsappApi", () => ({
  getInvistimoCutoverReadiness: vi.fn(async () => ({
    success: true,
    messagingAccountId: "1713214566994439",
    liveWabaId: "1042912532080617",
    phoneNumberId: "1325815400610124",
    executeEnabled: false,
    sendEnabled: false,
    registerEnabled: false,
    webhookEnabled: false,
    queuesPaused: false,
    activatesOnBoot: false,
    readyForWindow: false,
    readyToCutover: false,
    checks: [
      { id: "register_blocked", pass: true, detail: "POST /register is refused" },
      { id: "conversation_routing", pass: false, detail: "Business Suite change is still required" },
    ],
    windowOnly: [],
  })),
}));

describe("Invistimo cutover readiness panel", () => {
  it("shows missing window steps and no activation control", async () => {
    render(<InvistimoCutoverReadinessPanel businessId="6a8df4e95c704a03773a9966" />);
    expect(await screen.findByText("register_blocked")).toBeTruthy();
    expect(screen.getByText("conversation_routing")).toBeTruthy();
    expect(screen.getByText(/1713214566994439/)).toBeTruthy();
    expect(screen.getByText(/הקליטה החדשה כבויה/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /הפעל|cutover|שלח/i })).toBeNull();
    expect(screen.getByRole("button", { name: "רענון מוכנות" })).toBeTruthy();
  });
});
