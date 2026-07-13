const RAW_API_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.bizuply.com",
).trim();

const API_BASE = RAW_API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

export type DomainAvailabilityResult = {
  success: boolean;
  environment?: "ote" | "production";
  domain: string;
  available?: boolean;
  premium?: boolean;
  currency?: string | null;
  price?: number | null;
  reason?: string | null;
  rawStatus?: string | null;
  error?: string;
  errorType?: string;
};

export type DomainContactPayload = {
  name: string;
  organization?: string;
  address: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  state?: string;
  country: string;
  email: string;
  phone: string;
};

export type DomainContactResult = {
  success: boolean;
  environment?: "ote" | "production";
  message?: string;
  contact?: {
    handle: string;
    name: string;
    organization?: string | null;
    addressLine?: string[];
    postalCode?: string;
    city?: string;
    state?: string | null;
    country?: string;
    email?: string;
    voice?: string;
  };
  process?: {
    id?: string | null;
    status?: string | null;
  };
  error?: string;
  errorType?: string;
};

function getToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("token") || "";
}

function normalizeDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "");
}

function isValidDomain(domain: string) {
  if (!domain || domain.length > 253) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;

  return labels.every((label) => {
    if (!label || label.length > 63) return false;

    return (
      /^[a-z0-9-]+$/i.test(label) &&
      !label.startsWith("-") &&
      !label.endsWith("-")
    );
  });
}

async function readJson<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

function buildHeaders(hasJsonBody = false) {
  const token = getToken();

  return {
    Accept: "application/json",
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function checkDomainAvailability(
  value: string,
): Promise<DomainAvailabilityResult> {
  const domain = normalizeDomain(value);

  if (!isValidDomain(domain)) {
    throw new Error(
      "יש להזין דומיין תקין, לדוגמה mybusiness.co.il",
    );
  }

  const requestUrl =
    `${API_BASE}/api/domains/realtime-register/check` +
    `?domain=${encodeURIComponent(domain)}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    credentials: "include",
    headers: buildHeaders(false),
  });

  const data = await readJson<DomainAvailabilityResult>(response);

  if (!response.ok || !data?.success) {
    if (response.status === 404) {
      throw new Error(
        "נתיב בדיקת הדומיין לא נמצא בשרת.",
      );
    }

    throw new Error(
      data?.error ||
        `בדיקת זמינות הדומיין נכשלה (${response.status})`,
    );
  }

  return data;
}

export async function createOteDomainContact(
  payload: DomainContactPayload,
): Promise<DomainContactResult> {
  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/contacts`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  const data = await readJson<DomainContactResult>(response);

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.error ||
        `יצירת איש הקשר נכשלה (${response.status})`,
    );
  }

  return data;
}
