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

/** Normalize to international digits for wa.me (IL: 05x → 9725x). */
export function normalizeWhatsAppPhone(value: unknown): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `972${digits.slice(1)}`;
  else if (digits.length === 9 && digits.startsWith("5")) digits = `972${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message?: string) {
  const digits = normalizeWhatsAppPhone(phone);
  if (!digits) return "";
  const text = encodeURIComponent(String(message || "").trim());
  return text
    ? `https://wa.me/${digits}?text=${text}`
    : `https://wa.me/${digits}`;
}

const OVERLAY_PLACEHOLDER_KEYS = [
  "whatsapp-float",
  "announcement-bar",
  "cookie-banner",
  "exit-popup",
  "smart-bot",
  "sales-agent",
  "benefits-wheel",
  "smart-search",
  "accessibility",
];

/**
 * Remove obsolete in-page placeholder boxes for floating overlay plugins.
 * Never touch live overlay widgets (runtime / position:fixed).
 */
export function removeOverlayPluginPlaceholders(root?: ParentNode | null) {
  const scope = root || (typeof document !== "undefined" ? document : null);
  if (!scope) return 0;

  const selector = OVERLAY_PLACEHOLDER_KEYS.flatMap((key) => [
    `[data-bizuply-plugin="${key}"]`,
    `[data-bizuply-widget="${key}"]`,
  ]).join(", ");

  const markers = Array.from(scope.querySelectorAll<HTMLElement>(selector));
  let removed = 0;

  markers.forEach((marker) => {
    if (marker.getAttribute("data-bizuply-plugin-runtime") === "true") return;
    if (marker.closest('[data-bizuply-plugin-runtime="true"]')) return;

    try {
      const style = window.getComputedStyle(marker);
      if (style.position === "fixed") return;
    } catch {
      // ignore
    }

    const shell = marker.closest<HTMLElement>(
      '[data-bizuply-plugin-widget="true"], [data-visual-inserted-element="true"]'
    );
    const target = shell && shell.contains(marker) ? shell : marker;
    target.remove();
    removed += 1;
  });

  return removed;
}
