export type GuidedDemoModule = {
  key: string;
  title: string;
  description?: string;
  interactive?: boolean;
  simulationReason?: string | null;
};

export type GuidedDemoPreset = {
  key: string;
  title: string;
  description?: string;
  moduleKeys: string[];
};

export type GuidedDemoCatalog = {
  modules?: GuidedDemoModule[];
  presets?: GuidedDemoPreset[];
  ttlOptionsHours?: number[];
  defaultTtlHours?: number;
};

const PRIMARY_PRESET_ORDER = [
  "full",
  "crm-only",
  "website-only",
  "automations-only",
  "custom",
];

export function digitsOnly(raw: string) {
  return String(raw || "").replace(/\D/g, "");
}

export function isValidDemoPhone(raw: string) {
  const digits = digitsOnly(raw);
  if (!digits) return false;
  if (/^05\d{8}$/.test(digits)) return true;
  if (/^9725\d{8}$/.test(digits)) return true;
  if (/^009725\d{8}$/.test(digits)) return true;
  return false;
}

export function normalizeFullName(raw?: string | null) {
  return String(raw || "").trim().replace(/\s+/g, " ");
}

export function sourceNameForPrefill(sourceName?: string | null) {
  const value = normalizeFullName(sourceName);
  if (!value || value === "לא צוין") return "";
  const lower = value.toLowerCase();
  if (lower === "undefined" || lower === "null") return "";
  return value;
}

export function isValidFullName(raw?: string | null) {
  const value = normalizeFullName(raw);
  if (!value) return false;
  const lower = value.toLowerCase();
  if (lower === "undefined" || lower === "null") return false;
  if (value === "לא צוין" || value === "{{1}}" || lower === "{{firstname}}") return false;
  return true;
}

export function firstNameFromFullName(raw?: string | null) {
  const value = normalizeFullName(raw);
  if (!isValidFullName(value)) return "";
  return value.split(/\s+/)[0] || "";
}

export function sourcePhoneForPrefill(sourcePhone?: string | null) {
  const value = String(sourcePhone || "").trim();
  if (!value || value === "לא צוין") return "";
  return value;
}

export function orderedPresets(catalog?: GuidedDemoCatalog | null) {
  const presets = catalog?.presets || [];
  const rank = (key: string) => {
    const index = PRIMARY_PRESET_ORDER.indexOf(key);
    return index === -1 ? PRIMARY_PRESET_ORDER.length + 1 : index;
  };
  return [...presets].sort((a, b) => rank(a.key) - rank(b.key));
}

export function resolveSelectedKeys({
  catalog,
  presetKey,
  moduleKeys,
}: {
  catalog?: GuidedDemoCatalog | null;
  presetKey: string;
  moduleKeys: string[];
}) {
  if (presetKey === "custom") {
    const allowed = new Set((catalog?.modules || []).map((m) => m.key));
    return moduleKeys.filter((key) => allowed.has(key));
  }
  const preset = catalog?.presets?.find((p) => p.key === presetKey);
  return [...(preset?.moduleKeys || [])];
}

export function selectedModuleTitles(
  catalog: GuidedDemoCatalog | null | undefined,
  selectedKeys: string[]
) {
  return (catalog?.modules || [])
    .filter((mod) => selectedKeys.includes(mod.key))
    .map((mod) => mod.title);
}

export function demoContentSummary({
  catalog,
  presetKey,
  selectedKeys,
}: {
  catalog?: GuidedDemoCatalog | null;
  presetKey: string;
  selectedKeys: string[];
}) {
  if (!selectedKeys.length) return "";
  if (presetKey === "full") {
    return `דמו מלא — ${selectedKeys.length} מודולים`;
  }
  return selectedModuleTitles(catalog, selectedKeys).join(" · ");
}

export function canSubmitSendDemo({
  customerName,
  phone,
  selectedKeys,
}: {
  customerName: string;
  phone: string;
  selectedKeys: string[];
}) {
  return isValidFullName(customerName) && isValidDemoPhone(phone) && selectedKeys.length > 0;
}

export function payloadFingerprint(payload: {
  customerName: string;
  customerPhone: string;
  presetKey: string;
  moduleKeys: string[];
}) {
  return JSON.stringify({
    customerName: normalizeFullName(payload.customerName),
    customerPhone: payload.customerPhone.trim(),
    presetKey: payload.presetKey,
    moduleKeys: [...payload.moduleKeys].sort(),
  });
}

export function approvedNeedLabelFromCatalog({
  catalog,
  candidates,
}: {
  catalog?: GuidedDemoCatalog | null;
  candidates?: string[];
}) {
  const titles = new Set((catalog?.modules || []).map((m) => m.title));
  for (const value of candidates || []) {
    const label = String(value || "").trim();
    if (label && titles.has(label)) return label;
  }
  return "";
}

export function invitationIdOf(invitation: { id?: string; _id?: string } | null | undefined) {
  return String(invitation?.id || invitation?._id || "");
}

export const MANUAL_WHATSAPP_FIRST_NAME_FALLBACK = "שלום";

export type GuidedDemoInvitationRow = {
  id?: string;
  _id?: string;
  customerName?: string;
  customerPhone?: string;
  customerPhoneWhatsapp?: string;
  customerPhoneE164?: string;
  selectedModules?: string[];
  presetKey?: string;
  status?: string;
  createdAt?: string;
  expiresAt?: string | Date | null;
  redeemedAt?: string | Date | null;
  revokedAt?: string | Date | null;
  demoLink?: string;
  linkAvailable?: boolean;
  deliveryStatus?: string;
  completedSteps?: number;
  totalSteps?: number;
};

export function firstNameForManualShare(raw?: string | null) {
  return firstNameFromFullName(raw) || MANUAL_WHATSAPP_FIRST_NAME_FALLBACK;
}

export function whatsappShareDigits(phone: string) {
  let digits = digitsOnly(phone);
  if (/^05\d{8}$/.test(digits)) return `972${digits.slice(1)}`;
  if (/^009725\d{8}$/.test(digits)) return digits.slice(2);
  if (/^9725\d{8}$/.test(digits)) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `972${digits.slice(1)}`;
  return digits;
}

export function buildManualWhatsAppMessage({
  customerName,
  demoUrl,
}: {
  customerName?: string | null;
  demoUrl: string;
}) {
  const firstName = firstNameForManualShare(customerName);
  return [
    `היי ${firstName} 👋`,
    "",
    "כמו שסיכמנו, מצרף לך קישור לדמו אינטראקטיבי קצר של Bizuply:",
    "",
    demoUrl,
    "",
    "אפשר לעבור עליו בזמן שנוח לך.",
  ].join("\n");
}

export function buildManualWhatsAppUrl({
  phone,
  customerName,
  demoUrl,
}: {
  phone?: string | null;
  customerName?: string | null;
  demoUrl: string;
}) {
  const digits = whatsappShareDigits(String(phone || ""));
  if (!digits || !demoUrl) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    buildManualWhatsAppMessage({ customerName, demoUrl })
  )}`;
}

export function invitationPhone(invitation?: GuidedDemoInvitationRow | null, fallback = "") {
  return (
    invitation?.customerPhoneWhatsapp ||
    invitation?.customerPhoneE164 ||
    invitation?.customerPhone ||
    fallback ||
    ""
  );
}

export function invitationLinkAvailable(invitation?: GuidedDemoInvitationRow | null) {
  if (!invitation) return false;
  if (invitation.revokedAt || invitation.status === "revoked") return false;
  if (invitation.redeemedAt) return false;
  if (invitation.status === "expired") return false;
  if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() < Date.now()) return false;
  if (invitation.linkAvailable === false) return false;
  return Boolean(invitation.demoLink) || invitation.linkAvailable === true;
}

export function invitationNeedsNewLink(invitation?: GuidedDemoInvitationRow | null) {
  if (!invitation) return false;
  if (invitation.revokedAt || invitation.status === "revoked") return true;
  if (invitation.redeemedAt) return true;
  if (invitation.status === "expired") return true;
  if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() < Date.now()) return true;
  return false;
}

export function openExternalUrl(url?: string | null) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}
