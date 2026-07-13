const RAW_API_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.bizuply.com",
).trim();

const API_BASE = RAW_API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

export type DomainEnvironment = "ote" | "production";

export type DomainAvailabilityResult = {
  success: boolean;
  environment?: DomainEnvironment;
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
  domain: string;

  name: string;
  organization?: string;

  address: string;
  addressLine2?: string;
  addressLine3?: string;

  postalCode: string;
  city: string;
  state?: string;
  country: string;

  email: string;
  phone: string;

  brand?: string;

  availability?: boolean;
  premium?: boolean;
  currency?: string | null;
  price?: number | null;
  reason?: string | null;
  rawStatus?: string | null;
};

export type DomainContactResult = {
  success: boolean;
  environment?: DomainEnvironment;
  message?: string;

  registrationId?: string;
  domain?: string;
  status?: DomainRegistrationStatus;

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

export type DomainRegistrationStatus =
  | "availability_checked"
  | "contact_created"
  | "registration_pending"
  | "registered"
  | "registration_failed"
  | "cancelled";

export type DomainRegistration = {
  _id: string;

  business?: string | null;
  user?: string | null;

  domain: string;
  provider: "realtime-register";
  environment: DomainEnvironment;
  status: DomainRegistrationStatus;

  availability?: {
    available?: boolean | null;
    premium?: boolean;
    currency?: string | null;
    price?: number | null;
    reason?: string | null;
    rawStatus?: string | null;
  };

  contactHandle: string;

  contact?: {
    name?: string;
    organization?: string | null;
    addressLine?: string[];
    postalCode?: string;
    city?: string;
    state?: string | null;
    country?: string;
    email?: string;
    phone?: string;
  };

  providerProcess?: {
    id?: string | null;
    status?: string | null;
  };

  registration?: {
    period?: number;
    expirationDate?: string | null;
    registeredAt?: string | null;
    failedAt?: string | null;
    error?: string | null;
  };

  metadata?: Record<string, unknown>;

  createdAt?: string;
  updatedAt?: string;
};

export type DomainRegistrationsResult = {
  success: boolean;
  count: number;
  registrations: DomainRegistration[];
  error?: string;
  errorType?: string;
};

function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

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
  if (!domain || domain.length > 253) {
    return false;
  }

  const labels = domain.split(".");

  if (labels.length < 2) {
    return false;
  }

  return labels.every((label) => {
    if (!label || label.length > 63) {
      return false;
    }

    return (
      /^[a-z0-9-]+$/i.test(label) &&
      !label.startsWith("-") &&
      !label.endsWith("-")
    );
  });
}

async function readJson<T>(
  response: Response,
): Promise<T | null> {
  return (await response
    .json()
    .catch(() => null)) as T | null;
}

function buildHeaders(
  hasJsonBody = false,
): Record<string, string> {
  const token = getToken();

  return {
    Accept: "application/json",

    ...(hasJsonBody
      ? {
          "Content-Type": "application/json",
        }
      : {}),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

function getApiErrorMessage(
  response: Response,
  data:
    | {
        error?: string;
        message?: string;
      }
    | null,
  fallback: string,
) {
  if (response.status === 401) {
    return "אין הרשאה לביצוע הפעולה. התחברו מחדש ונסו שוב.";
  }

  if (response.status === 403) {
    return (
      data?.error ||
      "אין הרשאה לביצוע הפעולה."
    );
  }

  if (response.status === 404) {
    return (
      data?.error ||
      "הנתיב המבוקש לא נמצא בשרת."
    );
  }

  return (
    data?.error ||
    data?.message ||
    `${fallback} (${response.status})`
  );
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

  const data =
    await readJson<DomainAvailabilityResult>(
      response,
    );

  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(
        response,
        data,
        "בדיקת זמינות הדומיין נכשלה",
      ),
    );
  }

  return data;
}

export async function createOteDomainContact(
  payload: DomainContactPayload,
): Promise<DomainContactResult> {
  const cleanDomain =
    normalizeDomain(payload.domain);

  if (!isValidDomain(cleanDomain)) {
    throw new Error(
      "חובה לצרף דומיין תקין ליצירת איש הקשר",
    );
  }

  const requestPayload: DomainContactPayload = {
    ...payload,

    domain: cleanDomain,

    name:
      String(payload.name || "").trim(),

    organization:
      String(
        payload.organization || "",
      ).trim() || undefined,

    address:
      String(payload.address || "").trim(),

    addressLine2:
      String(
        payload.addressLine2 || "",
      ).trim() || undefined,

    addressLine3:
      String(
        payload.addressLine3 || "",
      ).trim() || undefined,

    postalCode:
      String(
        payload.postalCode || "",
      ).trim(),

    city:
      String(payload.city || "").trim(),

    state:
      String(
        payload.state || "",
      ).trim() || undefined,

    country:
      String(payload.country || "IL")
        .trim()
        .toUpperCase(),

    email:
      String(payload.email || "")
        .trim()
        .toLowerCase(),

    phone:
      String(payload.phone || "").trim(),

    brand:
      String(
        payload.brand || "default",
      ).trim(),

    availability:
      typeof payload.availability === "boolean"
        ? payload.availability
        : undefined,

    premium:
      Boolean(payload.premium),

    currency:
      payload.currency || null,

    price:
      typeof payload.price === "number"
        ? payload.price
        : null,

    reason:
      payload.reason || null,

    rawStatus:
      payload.rawStatus || null,
  };

  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/contacts`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify(
        requestPayload,
      ),
    },
  );

  const data =
    await readJson<DomainContactResult>(
      response,
    );

  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(
        response,
        data,
        "יצירת איש הקשר נכשלה",
      ),
    );
  }

  return data;
}

export async function getDomainRegistrations(): Promise<
  DomainRegistrationsResult
> {
  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/registrations`,
    {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(false),
    },
  );

  const data =
    await readJson<DomainRegistrationsResult>(
      response,
    );

  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(
        response,
        data,
        "טעינת רישומי הדומיין נכשלה",
      ),
    );
  }

  return {
    success: true,
    count: Number(data.count || 0),
    registrations: Array.isArray(
      data.registrations,
    )
      ? data.registrations
      : [],
  };
}
