import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  whatsappContacts: vi.fn(),
  whatsappComposeContext: vi.fn(),
  whatsappPreview: vi.fn(),
  whatsappSend: vi.fn(),
  createWhatsAppContact: vi.fn(),
  updateWhatsAppContact: vi.fn(),
}));

vi.mock("../../../../api/adminCrmApi", () => ({ default: api }));

import { WhatsAppNewMessageDialog } from "./WhatsAppNewMessageDialog";
import { adminWhatsAppCopy } from "./adminWhatsAppInboxCopy";

const copy = adminWhatsAppCopy("he");

function renderDialog() {
  return render(
    <WhatsAppNewMessageDialog
      open
      copy={copy}
      dir="rtl"
      connections={[{ managedConnectionId: "US_MANAGED" } as any]}
      onClose={() => undefined}
      onSent={() => undefined}
    />
  );
}

describe("WhatsAppNewMessageDialog outside the 24-hour window", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.whatsappContacts.mockResolvedValue({
      data: {
        items: [
          {
            id: "c1",
            companyName: "קולומביה",
            contactPersonName: "קולומביה",
            phone: "+573217404540",
            adminCustomerId: "cust-1",
          },
        ],
      },
    });
    api.whatsappComposeContext.mockResolvedValue({
      data: {
        sessionWindowOpen: false,
        templates: [{ id: "tpl-1", name: "Bizuply Partner Followup", languageLabel: "אנגלית" }],
      },
    });
    api.whatsappPreview.mockResolvedValue({
      data: { preview: { preview: "Hi there", mapped: { name: "Colombia" } } },
    });
    api.whatsappSend.mockResolvedValue({ data: { threadId: "t1", kind: "template" } });
  });

  it("enables Send for an approved template and sends via the template path", async () => {
    renderDialog();
    fireEvent.click(await screen.findByText("+573217404540"));
    const select = await screen.findByRole("combobox");
    await screen.findByRole("option", { name: /Bizuply Partner Followup/ });

    expect(screen.getByText(copy.outsideWindow)).toBeTruthy();
    const sendButton = screen.getByRole("button", { name: copy.send }) as HTMLButtonElement;
    expect(sendButton.disabled).toBe(true);

    fireEvent.change(select, { target: { value: "tpl-1" } });

    await waitFor(() => expect(sendButton.disabled).toBe(false));
    expect(screen.queryByText(copy.outsideWindow)).toBeNull();
    expect(screen.getByText(copy.templateSendableOutsideWindow)).toBeTruthy();

    fireEvent.click(sendButton);
    await waitFor(() => expect(api.whatsappSend).toHaveBeenCalledTimes(1));
    expect(api.whatsappSend).toHaveBeenCalledWith(
      "cust-1",
      expect.objectContaining({
        templateId: "tpl-1",
        body: "",
        previewConfirmed: true,
        managedConnectionId: "US_MANAGED",
        vars: { name: "Colombia" },
      })
    );
  });
});
