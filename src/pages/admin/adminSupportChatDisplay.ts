export type SupportChatChannel = "web" | "whatsapp" | string;

export type SupportChatMessage = {
  _id: string;
  senderType?: "visitor" | "bot" | "agent" | "system" | string;
  senderName?: string;
  text?: string;
  direction?: "inbound" | "outbound" | "";
  deliveryStatus?: string;
  providerMessageId?: string;
  createdAt?: string;
  metadata?: {
    error?: string;
    graphCode?: number | null;
    graphSubcode?: number | null;
    fbtraceId?: string;
    httpStatus?: number | null;
    managedConnectionId?: string;
    [key: string]: unknown;
  };
};

export function isOutboundSupportBubble(message: SupportChatMessage | null | undefined) {
  if (!message) return false;
  if (message.direction === "outbound") return true;
  if (message.direction === "inbound") return false;
  return message.senderType === "agent" || message.senderType === "bot";
}

export function deliveryStatusLabel(status?: string) {
  switch (String(status || "")) {
    case "sending":
      return "שולח";
    case "sent":
      return "נשלח";
    case "delivered":
      return "נמסר";
    case "read":
      return "נקרא";
    case "failed":
      return "נכשל";
    default:
      return "";
  }
}

/** Real Meta / WhatsApp failure reason for admin bubbles (not just "נכשל"). */
export function deliveryFailureDetail(message?: SupportChatMessage | null) {
  const meta = message?.metadata || {};
  const raw = String(meta.error || "").trim();
  if (raw) return raw.slice(0, 500);

  const bits: string[] = [];
  if (meta.graphCode != null) bits.push(`code ${meta.graphCode}`);
  if (meta.graphSubcode != null) bits.push(`subcode ${meta.graphSubcode}`);
  if (meta.fbtraceId) bits.push(`fbtrace ${meta.fbtraceId}`);
  if (meta.httpStatus != null) bits.push(`http ${meta.httpStatus}`);
  return bits.join(" — ").slice(0, 500);
}

const URL_OR_PHONE =
  /(https?:\/\/[^\s]+)|(\+?\d[\d\- ]{7,}\d)/g;

export function splitMessageSegments(text: string) {
  const value = String(text || "");
  const parts: Array<{ type: "text" | "url" | "phone"; value: string }> = [];
  let last = 0;
  for (const match of value.matchAll(URL_OR_PHONE)) {
    const index = match.index || 0;
    if (index > last) {
      parts.push({ type: "text", value: value.slice(last, index) });
    }
    const raw = match[0];
    parts.push({
      type: raw.startsWith("http") ? "url" : "phone",
      value: raw,
    });
    last = index + raw.length;
  }
  if (last < value.length) {
    parts.push({ type: "text", value: value.slice(last) });
  }
  return parts.length ? parts : [{ type: "text" as const, value }];
}

export function formatWhatsAppPhoneDisplay(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("972") && digits.length >= 11) {
    return `0${digits.slice(3)}`;
  }
  if (digits.startsWith("0")) return digits;
  return `+${digits}`;
}

/** Compact US / IL badge for WhatsApp support conversations. */
export function supportConnectionBadge(
  conversation?: {
    managedConnectionId?: string | null;
    connectionCountry?: string | null;
    connectionLabel?: string | null;
  } | null
) {
  const country = String(conversation?.connectionCountry || "")
    .trim()
    .toUpperCase();
  if (country) return country;
  const id = String(conversation?.managedConnectionId || "")
    .trim()
    .toUpperCase();
  if (id === "US_MANAGED") return "US";
  if (id === "IL_MANAGED") return "IL";
  if (id.endsWith("_MANAGED")) return id.replace(/_MANAGED$/, "");
  return id.slice(0, 3);
}

/** Human brand for managed WhatsApp lines: Bizuply US / Bizuply IL */
export function bizuplyConnectionBrand(managedConnectionId?: string | null) {
  const id = String(managedConnectionId || "")
    .trim()
    .toUpperCase();
  if (id === "US_MANAGED") return "Bizuply US";
  if (id === "IL_MANAGED") return "Bizuply IL";
  if (id.endsWith("_MANAGED")) {
    return `Bizuply ${id.replace(/_MANAGED$/, "")}`;
  }
  return id ? `Bizuply ${id}` : "";
}

export function resolveManagedConnectionId(
  ...values: Array<string | null | undefined>
) {
  for (const value of values) {
    const id = String(value || "")
      .trim()
      .toUpperCase();
    if (id) return id;
  }
  return "";
}

/** Conversation via: Bizuply US · +1 … · US_MANAGED */
export function supportConversationViaLabel(
  conversation?: {
    managedConnectionId?: string | null;
    businessDisplayPhone?: string | null;
    connectionLabel?: string | null;
  } | null
) {
  const id = resolveManagedConnectionId(conversation?.managedConnectionId);
  if (!id) return "";
  const brand =
    bizuplyConnectionBrand(id) ||
    String(conversation?.connectionLabel || "").trim() ||
    id;
  const phone = String(conversation?.businessDisplayPhone || "").trim();
  return [brand, phone, id].filter(Boolean).join(" · ");
}

/** Sending from: Bizuply US (+1 …) */
export function supportSendingFromLabel(
  conversation?: {
    managedConnectionId?: string | null;
    businessDisplayPhone?: string | null;
    connectionLabel?: string | null;
  } | null
) {
  const id = resolveManagedConnectionId(conversation?.managedConnectionId);
  if (!id) return "";
  const brand =
    bizuplyConnectionBrand(id) ||
    String(conversation?.connectionLabel || "").trim() ||
    id;
  const phone = String(conversation?.businessDisplayPhone || "").trim();
  return phone ? `${brand} (${phone})` : brand;
}

/**
 * Sent via US_MANAGED · +1 …
 * Prefer message-level managedConnectionId; fall back to conversation.
 */
export function supportSentViaLabel(
  message?: SupportChatMessage | null,
  conversation?: {
    managedConnectionId?: string | null;
    businessDisplayPhone?: string | null;
  } | null
) {
  const id = resolveManagedConnectionId(
    message?.metadata?.managedConnectionId as string | undefined,
    conversation?.managedConnectionId
  );
  if (!id) return "";
  const phone = String(
    (message?.metadata?.businessDisplayPhone as string | undefined) ||
      conversation?.businessDisplayPhone ||
      ""
  ).trim();
  return phone ? `Sent via ${id} · ${phone}` : `Sent via ${id}`;
}
