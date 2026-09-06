import i18n from "../../../../i18n/i18n";

export type EmailProviderId = "gmail" | "outlook" | "business";

export function getEmailProviderRequired() {
  return i18n.t(
    "leftover.emailProvider.required",
    "To use this automation, connect Gmail or Outlook / Microsoft 365"
  );
}

export function getEmailTemplateConnectCta() {
  return i18n.t(
    "leftover.emailProvider.connectCta",
    "To enable the template, connect Gmail or Outlook / Microsoft 365"
  );
}

export function getBusinessEmailMissingTitle() {
  return i18n.t("leftover.emailProvider.missingTitle", "No verified business email is set");
}

export function getBusinessEmailMissingBody() {
  return i18n.t(
    "leftover.emailProvider.missingBody",
    "To send from the business email, finish setting it up and verifying it first."
  );
}

export function getBusinessEmailSettingsCta() {
  return i18n.t("leftover.emailProvider.settingsCta", "Set up business email");
}

export function getBusinessEmailSenderUnavailable() {
  return i18n.t(
    "leftover.emailProvider.senderUnavailable",
    "The selected sender email is unavailable or not verified. Choose another sender."
  );
}

export const EMAIL_PROVIDER_REQUIRED_HE = getEmailProviderRequired;
export const EMAIL_TEMPLATE_CONNECT_CTA_HE = getEmailTemplateConnectCta;
export const BUSINESS_EMAIL_MISSING_TITLE_HE = getBusinessEmailMissingTitle;
export const BUSINESS_EMAIL_MISSING_BODY_HE = getBusinessEmailMissingBody;
export const BUSINESS_EMAIL_SETTINGS_CTA_HE = getBusinessEmailSettingsCta;
export const BUSINESS_EMAIL_SENDER_UNAVAILABLE_HE = getBusinessEmailSenderUnavailable;

export function getEmailProviderOptions(): Array<{
  id: EmailProviderId;
  label: string;
}> {
  return [
    { id: "gmail", label: "Gmail" },
    { id: "outlook", label: "Outlook / Microsoft 365" },
    {
      id: "business",
      label: i18n.t("leftover.emailProvider.businessMail", "Business email"),
    },
  ];
}

export const EMAIL_PROVIDER_OPTIONS = {
  map: (...args: Parameters<Array<{ id: EmailProviderId; label: string }>["map"]>) =>
    getEmailProviderOptions().map(...args),
  [Symbol.iterator]: function* () {
    yield* getEmailProviderOptions();
  },
} as Array<{ id: EmailProviderId; label: string }>;

/** Placeholder action key in template graphs — rewritten before publish. */
export const CONNECTED_EMAIL_ACTION_KEY = "connected_email";

export type EmailConnectionState = {
  gmailConnected?: boolean;
  outlookConnected?: boolean;
};

export type BusinessEmailSender = {
  senderId: string;
  email: string;
  displayName?: string;
  type?: string;
  isDefault?: boolean;
};

export function listConnectedEmailProviders(
  ctx: EmailConnectionState
): Array<Extract<EmailProviderId, "gmail" | "outlook">> {
  const providers: Array<Extract<EmailProviderId, "gmail" | "outlook">> = [];
  if (ctx.gmailConnected) providers.push("gmail");
  if (ctx.outlookConnected) providers.push("outlook");
  return providers;
}

export function hasConnectedEmailProvider(ctx: EmailConnectionState): boolean {
  return listConnectedEmailProviders(ctx).length > 0;
}

export function resolveEmailProvider(
  ctx: EmailConnectionState,
  preferred?: EmailProviderId | null
): EmailProviderId | null {
  const connected = listConnectedEmailProviders(ctx);
  if (preferred === "business") return "business";
  if (!connected.length) return preferred === "business" ? "business" : null;
  if (preferred && connected.includes(preferred as "gmail" | "outlook")) {
    return preferred;
  }
  if (connected.length === 1) return connected[0];
  return null;
}

export function emailActionKeyForProvider(
  provider: EmailProviderId
): "send_gmail" | "send_outlook" | "send_email" {
  if (provider === "outlook") return "send_outlook";
  if (provider === "business") return "send_email";
  return "send_gmail";
}

export function emailProviderRuntimeValue(
  provider: Extract<EmailProviderId, "gmail" | "outlook">
): "gmail" | "microsoft" {
  return provider === "outlook" ? "microsoft" : "gmail";
}

export function formatBusinessSenderLabel(sender: {
  displayName?: string;
  email?: string;
}) {
  const name = String(sender.displayName || "")
    .replace(/[<>]/g, "")
    .trim();
  const email = String(sender.email || "").trim();
  if (name && email) return `${name} — ${email}`;
  return name || email;
}

export function pickDefaultBusinessSender(
  senders: BusinessEmailSender[]
): BusinessEmailSender | null {
  if (!senders.length) return null;
  return senders.find((row) => row.isDefault) || senders[0];
}

export type SendEmailSenderFields = {
  senderId?: string;
  senderEmail?: string;
  senderName?: string;
  senderType?: string;
};

function senderFieldsFrom(sender: BusinessEmailSender): SendEmailSenderFields {
  return {
    senderId: sender.senderId,
    senderEmail: sender.email || "",
    senderName: sender.displayName || "",
    senderType: sender.type || "",
  };
}

/**
 * Default sender is only for nodes with no explicit choice.
 * A saved senderId must never be replaced by the business default.
 */
export function nextSendEmailSenderFields(
  current: SendEmailSenderFields,
  senders: BusinessEmailSender[]
): SendEmailSenderFields | null {
  const currentId = String(current.senderId || "").trim();
  if (!currentId) {
    const fallback = pickDefaultBusinessSender(senders);
    return fallback ? senderFieldsFrom(fallback) : null;
  }
  const selected = senders.find((row) => row.senderId === currentId);
  if (!selected) return null;
  const next = senderFieldsFrom(selected);
  if (
    String(current.senderEmail || "") === String(next.senderEmail || "") &&
    String(current.senderName || "") === String(next.senderName || "") &&
    String(current.senderType || "") === String(next.senderType || "")
  ) {
    return null;
  }
  return next;
}

export type GraphEmailAction = {
  actionKey: string;
  label: string;
  defaults?: Record<string, unknown>;
};

export function isConnectedEmailActionKey(actionKey: string): boolean {
  return (
    actionKey === CONNECTED_EMAIL_ACTION_KEY ||
    actionKey === "send_gmail" ||
    actionKey === "send_outlook"
  );
}

export function resolveConnectedEmailAction(
  action: GraphEmailAction,
  provider?: EmailProviderId | null,
  sender?: BusinessEmailSender | null
): GraphEmailAction {
  if (!isConnectedEmailActionKey(action.actionKey)) return action;
  if (provider === "business") {
    return {
      ...action,
      actionKey: "send_email",
      defaults: {
        ...(action.defaults || {}),
        senderId: sender?.senderId || "",
        senderEmail: sender?.email || "",
        senderName: sender?.displayName || "",
        senderType: sender?.type || "bizuply_smtp",
      },
    };
  }
  const resolved: Extract<EmailProviderId, "gmail" | "outlook"> =
    provider === "outlook" ? "outlook" : "gmail";
  const actionKey = emailActionKeyForProvider(resolved);
  return {
    ...action,
    actionKey,
    defaults: {
      ...(action.defaults || {}),
      emailProvider: emailProviderRuntimeValue(resolved),
    },
  };
}

export function applyEmailProviderToActions<T extends GraphEmailAction>(
  actions: T[],
  provider?: EmailProviderId | null,
  sender?: BusinessEmailSender | null
): T[] {
  return actions.map(
    (action) =>
      resolveConnectedEmailAction(action, provider, sender) as T
  );
}
