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
