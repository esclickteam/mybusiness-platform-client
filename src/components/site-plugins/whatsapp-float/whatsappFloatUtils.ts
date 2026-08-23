export type WhatsAppAgent = {
  id: string;
  name: string;
  phone: string;
  message?: string;
};

export type WhatsAppFloatSettings = {
  isActive: boolean;
  phone: string;
  message: string;
  showOnMobile: boolean;
  showOnDesktop?: boolean;
  triggerPosition: { x: number; y: number };
  agents?: WhatsAppAgent[];
  workingHours?: {
    enabled?: boolean;
    timezone?: string;
    days?: Record<string, { start?: string; end?: string }>;
  };
  offlineMessage?: string;
  pageTargeting?: { mode?: "all" | "include" | "exclude"; pageIds?: string[] };
  pageMessages?: Record<string, string>;
};

const DEFAULTS: WhatsAppFloatSettings = {
  isActive: true,
  phone: "",
  message: "\u05e9\u05dc\u05d5\u05dd, \u05d0\u05e9\u05de\u05d7 \u05dc\u05e4\u05e8\u05d8\u05d9\u05dd",
  showOnMobile: true,
  showOnDesktop: true,
  triggerPosition: { x: 8, y: 88 },
  agents: [],
  workingHours: { enabled: false, timezone: "Asia/Jerusalem", days: {} },
  offlineMessage: "",
  pageTargeting: { mode: "all", pageIds: [] },
  pageMessages: {},
};

export function mergeWhatsAppFloatSettings(
  stored?: Partial<WhatsAppFloatSettings> | null
): WhatsAppFloatSettings {
  const merged = { ...DEFAULTS, ...(stored || {}) };
  const pos = stored?.triggerPosition || DEFAULTS.triggerPosition;
  merged.triggerPosition = {
    x: Math.min(96, Math.max(4, Number(pos?.x) || DEFAULTS.triggerPosition.x)),
    y: Math.min(96, Math.max(4, Number(pos?.y) || DEFAULTS.triggerPosition.y)),
  };
  return merged;
}

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

export function isWhatsAppWithinHours(settings: WhatsAppFloatSettings, now = new Date()) {
  const hours = settings.workingHours;
  if (!hours?.enabled) return true;
  const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()];
  const slot = hours.days?.[day];
  if (!slot || !slot.start || !slot.end) return false;
  const current = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = String(slot.start).split(":").map(Number);
  const [eh, em] = String(slot.end).split(":").map(Number);
  return current >= sh * 60 + (sm || 0) && current <= eh * 60 + (em || 0);
}

export function matchesPageTarget(
  targeting: { mode?: string; pageIds?: string[] } | undefined,
  pageId?: string
) {
  const mode = targeting?.mode || "all";
  const ids = targeting?.pageIds || [];
  if (mode === "all" || !ids.length) return true;
  const path =
    typeof window !== "undefined"
      ? String(window.location.pathname || "/").replace(/\/+$/, "") || "/"
      : "";
  const slug = path.replace(/^\//, "") || "home";
  const candidates = [pageId, path, slug, `/${slug}`].filter(Boolean).map(String);
  const hit = ids.some((id) => candidates.includes(String(id)));
  return mode === "include" ? hit : !hit;
}

export function matchesDeviceTarget(
  targeting: { desktop?: boolean; tablet?: boolean; mobile?: boolean } | undefined,
  width = typeof window === "undefined" ? 1200 : window.innerWidth
) {
  const device = width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  if (!targeting) return true;
  if (targeting[device] === false) return false;
  return true;
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
  "multi-language",
  "social-proof",
  "floating-contact-bar",
  "faq-pro",
  "analytics-pro",
  "seo-pro",
  "refer-a-friend",
  "birthday-club",
  "form-to-pdf",
  "smart-forms",
  "qr-generator",
];

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
      if (window.getComputedStyle(marker).position === "fixed") return;
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
