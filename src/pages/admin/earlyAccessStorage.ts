export type EarlyAccessStatus = "new" | "contacted" | "closed";

export type EarlyAccessRegistration = {
  id: string;
  fullName: string;
  phone: string;
  businessName: string;
  interest: string;
  source: string;
  status: EarlyAccessStatus;
  createdAt: string;
  updatedAt: string;

  // שומר גם כל שדה נוסף מהטופס, כדי שלא ילך לאיבוד
  fields: Record<string, string>;
};

export type EarlyAccessRegistrationInput = {
  fullName?: string;
  name?: string;
  phone?: string;
  whatsapp?: string;
  businessName?: string;
  business?: string;
  interest?: string;
  interestedIn?: string;
  source?: string;
  status?: EarlyAccessStatus;
  fields?: Record<string, string>;
};

export const EARLY_ACCESS_STORAGE_KEY = "bizuply_early_access_registrations";
export const EARLY_ACCESS_EVENT_NAME = "bizuply:early-access-updated";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `early-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clean(value: unknown) {
  return String(value || "").trim();
}

function emitUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EARLY_ACCESS_EVENT_NAME));
}

function normalizeStatus(value: unknown): EarlyAccessStatus {
  if (value === "contacted") return "contacted";
  if (value === "closed") return "closed";
  return "new";
}

function normalizeRegistration(item: any): EarlyAccessRegistration {
  const now = new Date().toISOString();

  const fullName = clean(item?.fullName || item?.name);
  const phone = clean(item?.phone || item?.whatsapp);
  const businessName = clean(item?.businessName || item?.business);
  const interest = clean(item?.interest || item?.interestedIn);

  return {
    id: clean(item?.id || item?._id) || createId(),
    fullName,
    phone,
    businessName,
    interest,
    source: clean(item?.source) || "טופס הרשמה מוקדמת",
    status: normalizeStatus(item?.status),
    createdAt: clean(item?.createdAt) || now,
    updatedAt: clean(item?.updatedAt) || now,
    fields: {
      ...(item?.fields || {}),
      fullName,
      phone,
      businessName,
      interest,
    },
  };
}

export function getEarlyAccessRegistrations(): EarlyAccessRegistration[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(EARLY_ACCESS_STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeRegistration)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  } catch (error) {
    console.error("Failed reading early access registrations:", error);
    return [];
  }
}

export function setEarlyAccessRegistrations(items: EarlyAccessRegistration[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(EARLY_ACCESS_STORAGE_KEY, JSON.stringify(items));
  emitUpdate();
}

export function saveEarlyAccessRegistration(input: EarlyAccessRegistrationInput) {
  const registrations = getEarlyAccessRegistrations();
  const now = new Date().toISOString();

  const fullName = clean(input.fullName || input.name);
  const phone = clean(input.phone || input.whatsapp);
  const businessName = clean(input.businessName || input.business);
  const interest = clean(input.interest || input.interestedIn);

  const existingIndex = registrations.findIndex((item) => {
    return phone && item.phone === phone;
  });

  const nextItem: EarlyAccessRegistration = {
    id: existingIndex >= 0 ? registrations[existingIndex].id : createId(),
    fullName,
    phone,
    businessName,
    interest,
    source: clean(input.source) || "טופס הרשמה מוקדמת",
    status: input.status || "new",
    createdAt: existingIndex >= 0 ? registrations[existingIndex].createdAt : now,
    updatedAt: now,
    fields: {
      ...(input.fields || {}),
      fullName,
      phone,
      businessName,
      interest,
    },
  };

  if (existingIndex >= 0) {
    registrations[existingIndex] = {
      ...registrations[existingIndex],
      ...nextItem,
    };
  } else {
    registrations.unshift(nextItem);
  }

  setEarlyAccessRegistrations(registrations);

  return nextItem;
}

export function updateEarlyAccessRegistration(
  id: string,
  patch: Partial<EarlyAccessRegistration>
) {
  const registrations = getEarlyAccessRegistrations();

  const next = registrations.map((item) => {
    if (item.id !== id) return item;

    return {
      ...item,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
  });

  setEarlyAccessRegistrations(next);
}

export function deleteEarlyAccessRegistration(id: string) {
  const registrations = getEarlyAccessRegistrations();
  setEarlyAccessRegistrations(registrations.filter((item) => item.id !== id));
}