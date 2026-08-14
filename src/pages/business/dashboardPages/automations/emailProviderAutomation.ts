export type EmailProviderId = "gmail" | "outlook" | "business";

export const EMAIL_PROVIDER_REQUIRED_HE =
  "כדי להשתמש באוטומציה הזו יש לחבר Gmail או Outlook / Microsoft 365";

export const EMAIL_TEMPLATE_CONNECT_CTA_HE =
  "כדי להפעיל את התבנית יש לחבר Gmail או Outlook / Microsoft 365";

export const BUSINESS_EMAIL_MISSING_TITLE_HE = "לא הוגדר מייל עסקי מאומת";

export const BUSINESS_EMAIL_MISSING_BODY_HE =
  "כדי לשלוח מהמייל העסקי של העסק, יש להשלים קודם את הגדרת המייל ואימותו.";

export const BUSINESS_EMAIL_SETTINGS_CTA_HE = "הגדרת מייל עסקי";

export const EMAIL_PROVIDER_OPTIONS: Array<{
  id: EmailProviderId;
  label: string;
}> = [
  { id: "gmail", label: "Gmail" },
  { id: "outlook", label: "Outlook / Microsoft 365" },
  { id: "business", label: "מייל עסקי" },
];

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
