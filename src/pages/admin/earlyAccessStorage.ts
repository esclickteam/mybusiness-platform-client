export type EarlyAccessStatus = "new" | "contacted" | "closed";

export type EarlyAccessRegistration = {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  message: string;
  source: string;
  status: EarlyAccessStatus;
  createdAt: string;
  updatedAt: string;
};

export type EarlyAccessRegistrationInput = {
  name?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  message?: string;
  source?: string;
  status?: EarlyAccessStatus;
};

export const EARLY_ACCESS_STORAGE_KEY = "bizuply_early_access_registrations";
export const EARLY_ACCESS_EVENT_NAME = "bizuply:early-access-updated";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `early-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function emitEarlyAccessUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EARLY_ACCESS_EVENT_NAME));
}

function normalizeRegistration(item: any): EarlyAccessRegistration {
  const now = new Date().toISOString();

  return {
    id: normalizeText(item?.id || item?._id) || createId(),
    name: normalizeText(item?.name || item?.fullName) || "ללא שם",
    phone: normalizeText(item?.phone || item?.phoneNumber || item?.mobile),
    email: normalizeText(item?.email),
    businessName: normalizeText(
      item?.businessName || item?.business || item?.companyName
    ),
    message: normalizeText(item?.message || item?.notes || item?.comment),
    source: normalizeText(item?.source) || "טופס הרשמה מוקדמת",
    status:
      item?.status === "contacted" || item?.status === "closed"
        ? item.status
        : "new",
    createdAt: normalizeText(item?.createdAt) || now,
    updatedAt: normalizeText(item?.updatedAt) || now,
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
    console.error("Failed to read early access registrations:", error);
    return [];
  }
}

export function setEarlyAccessRegistrations(items: EarlyAccessRegistration[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(EARLY_ACCESS_STORAGE_KEY, JSON.stringify(items));
  emitEarlyAccessUpdate();
}

export function saveEarlyAccessRegistration(input: EarlyAccessRegistrationInput) {
  const registrations = getEarlyAccessRegistrations();
  const now = new Date().toISOString();

  const phone = normalizeText(input.phone);
  const email = normalizeText(input.email).toLowerCase();

  const existingIndex = registrations.findIndex((item) => {
    const samePhone = phone && item.phone === phone;
    const sameEmail = email && item.email.toLowerCase() === email;
    return Boolean(samePhone || sameEmail);
  });

  const nextItem: EarlyAccessRegistration = {
    id:
      existingIndex >= 0
        ? registrations[existingIndex].id
        : createId(),
    name: normalizeText(input.name) || "ללא שם",
    phone,
    email,
    businessName: normalizeText(input.businessName),
    message: normalizeText(input.message),
    source: normalizeText(input.source) || "טופס הרשמה מוקדמת",
    status: input.status || "new",
    createdAt:
      existingIndex >= 0
        ? registrations[existingIndex].createdAt
        : now,
    updatedAt: now,
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

  const nextRegistrations = registrations.map((item) => {
    if (item.id !== id) return item;

    return {
      ...item,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
  });

  setEarlyAccessRegistrations(nextRegistrations);
}

export function deleteEarlyAccessRegistration(id: string) {
  const registrations = getEarlyAccessRegistrations();
  setEarlyAccessRegistrations(registrations.filter((item) => item.id !== id));
}

export function clearEarlyAccessRegistrations() {
  setEarlyAccessRegistrations([]);
}