export type WhatsAppFloatSettings = {
  isActive: boolean;
  phone: string;
  message: string;
  showOnMobile: boolean;
};

const DEFAULTS: WhatsAppFloatSettings = {
  isActive: true,
  phone: "",
  message: "שלום, אשמח לפרטים",
  showOnMobile: true,
};

export function mergeWhatsAppFloatSettings(
  stored?: Partial<WhatsAppFloatSettings> | null
): WhatsAppFloatSettings {
  return { ...DEFAULTS, ...(stored || {}) };
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const text = encodeURIComponent(String(message || "").trim());
  return text
    ? `https://wa.me/${digits}?text=${text}`
    : `https://wa.me/${digits}`;
}
