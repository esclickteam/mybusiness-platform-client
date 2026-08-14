import { describe, expect, it } from "vitest";
import {
  applyEmailProviderToActions,
  formatBusinessSenderLabel,
  nextSendEmailSenderFields,
  pickDefaultBusinessSender,
} from "./emailProviderAutomation";

describe("emailProviderAutomation business email", () => {
  const actions = [
    {
      actionKey: "connected_email",
      label: "אימייל אישור",
      defaults: { subject: "שלום" },
    },
  ];

  it("keeps Gmail and Outlook rewrites unchanged", () => {
    expect(applyEmailProviderToActions(actions, "gmail")[0].actionKey).toBe(
      "send_gmail"
    );
    expect(applyEmailProviderToActions(actions, "outlook")[0].actionKey).toBe(
      "send_outlook"
    );
  });

  it("rewrites connected_email to send_email with the verified sender", () => {
    const sender = {
      senderId: "abc",
      email: "support@invistimo.com",
      displayName: "Invistimo",
      type: "bizuply_smtp",
      isDefault: true,
    };
    const [action] = applyEmailProviderToActions(actions, "business", sender);
    expect(action.actionKey).toBe("send_email");
    expect(action.defaults).toMatchObject({
      subject: "שלום",
      senderId: "abc",
      senderEmail: "support@invistimo.com",
      senderName: "Invistimo",
    });
  });

  it("does not replace an explicit sender with the default", () => {
    const senders = [
      {
        senderId: "default-id",
        email: "orders@bizuply.com",
        displayName: "Push Trial E2E",
        type: "bizuply_smtp",
        isDefault: true,
      },
      {
        senderId: "invistimo-id",
        email: "support@invistimo.com",
        displayName: "Invistimo",
        type: "bizuply_smtp",
        isDefault: false,
      },
    ];
    expect(
      nextSendEmailSenderFields(
        {
          senderId: "invistimo-id",
          senderEmail: "support@invistimo.com",
          senderName: "Invistimo",
          senderType: "bizuply_smtp",
        },
        senders
      )
    ).toBeNull();
    expect(
      nextSendEmailSenderFields(
        { senderId: "invistimo-id" },
        senders
      )
    ).toMatchObject({
      senderId: "invistimo-id",
      senderEmail: "support@invistimo.com",
      senderName: "Invistimo",
    });
    expect(
      nextSendEmailSenderFields({ senderId: "" }, senders)
    ).toMatchObject({
      senderId: "default-id",
      senderEmail: "orders@bizuply.com",
    });
    expect(
      nextSendEmailSenderFields(
        { senderId: "invistimo-id", senderEmail: "support@invistimo.com" },
        [senders[0]]
      )
    ).toBeNull();
  });

  it("formats sender labels and picks the default", () => {
    expect(
      formatBusinessSenderLabel({
        displayName: "Invistimo",
        email: "support@invistimo.com",
      })
    ).toBe("Invistimo — support@invistimo.com");
    expect(
      pickDefaultBusinessSender([
        { senderId: "1", email: "a@x.com", isDefault: false },
        { senderId: "2", email: "b@x.com", isDefault: true },
      ])?.senderId
    ).toBe("2");
  });
});
