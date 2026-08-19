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
