export type EmailProviderId = "gmail" | "outlook";

export const EMAIL_PROVIDER_REQUIRED_HE =
  "כדי להשתמש באוטומציה הזו יש לחבר Gmail או Outlook / Microsoft 365";

export const EMAIL_TEMPLATE_CONNECT_CTA_HE =
  "כדי להפעיל את התבנית יש לחבר Gmail או Outlook / Microsoft 365";

/** Placeholder action key in template graphs — rewritten before publish. */
export const CONNECTED_EMAIL_ACTION_KEY = "connected_email";

export type EmailConnectionState = {
  gmailConnected?: boolean;
  outlookConnected?: boolean;
};

export function listConnectedEmailProviders(
  ctx: EmailConnectionState
): EmailProviderId[] {
  const providers: EmailProviderId[] = [];
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
  if (!connected.length) return null;
  if (preferred && connected.includes(preferred)) return preferred;
  if (connected.length === 1) return connected[0];
  return null;
}

export function emailActionKeyForProvider(
  provider: EmailProviderId
): "send_gmail" | "send_outlook" {
  return provider === "outlook" ? "send_outlook" : "send_gmail";
}

export function emailProviderRuntimeValue(
  provider: EmailProviderId
): "gmail" | "microsoft" {
  return provider === "outlook" ? "microsoft" : "gmail";
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
  provider?: EmailProviderId | null
): GraphEmailAction {
  if (!isConnectedEmailActionKey(action.actionKey)) return action;
  const resolved: EmailProviderId = provider === "outlook" ? "outlook" : "gmail";
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
  provider?: EmailProviderId | null
): T[] {
  return actions.map(
    (action) => resolveConnectedEmailAction(action, provider) as T
  );
}