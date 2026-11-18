import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InvistimoPendingTemplatesPanel from "./InvistimoPendingTemplatesPanel";

vi.mock("../../../../api/whatsappApi", () => ({
  listInvistimoPendingTemplates: vi.fn(async () => ({
    success: true,
    readOnly: true,
    persisted: false,
    sendEnabled: false,
    editEnabled: false,
    activateEnabled: false,
    source: "pending_messaging_account",
    messagingAccountId: "1713214566994439",
    liveWabaId: "1042912532080617",
    phoneNumberId: "1325815400610124",
    accountName: "Invistimo - Bizuply LLC",
    approvedCount: 1,
    templates: [
      {
        name: "rsvp_invitation_media",
        language: "he",
        category: "MARKETING",
        status: "APPROVED",
        preview: {
          header: "הזמנה",
          body: "שלום {{1}}",
          footer: "Invistimo",
          buttons: ["url: לאירוע"],
        },
      },
    ],
  })),
}));

describe("Invistimo pending template panel", () => {
  it("shows the Bizuply catalog separately and without send or edit actions", async () => {
    render(<InvistimoPendingTemplatesPanel businessId="6a8df4e95c704a03773a9966" />);
    expect(await screen.findByText("rsvp_invitation_media")).toBeTruthy();
    expect(screen.getByText("MARKETING")).toBeTruthy();
    expect(screen.getByText("APPROVED")).toBeTruthy();
    expect(screen.getByText(/1713214566994439/)).toBeTruthy();
    expect(screen.getByText(/1042912532080617/)).toBeTruthy();
    expect(screen.getByText(/שלום \{\{1\}\}/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /send|שלח|עריכה|הפעלה/i })).toBeNull();
    expect(screen.getByRole("button", { name: "רענון תצוגה" })).toBeTruthy();
  });
});
