import { getApiOrigin } from "../config/runtimeUrls";

const API_BASE = getApiOrigin();

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
  vatNumber?: string;

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
  | "cancelled"
  | "expired"
  | "payment_required";


export type DomainRenewalStatus =
  | "not_due"
  | "awaiting_payment"
  | "quote_required"
  | "checkout_created"
  | "paid"
  | "renewal_in_progress"
  | "renewed"
  | "payment_failed"
  | "renewal_failed"
  | "expired"
  | "none"
  | "payment_received";

export type DomainRenewalUiCta =
  | "renew"
  | "request_quote"
  | "continue_payment"
  | "in_progress"
  | "retry"
  | "renewed";

export type DomainRenewalQuote = {
  customerRenewalPrice?: number | null;
  providerRenewalCost?: number | null;
  currency?: string;
  quoteExpiresAt?: string | null;
  quoteCached?: boolean;
  quoteRequired?: boolean;
  message?: string | null;
  pricingSource?: string | null;
};

export type DomainRenewalInfo = {
  status?: DomainRenewalStatus;
  autoRenew?: boolean;
  lastRenewedAt?: string | null;
  lastRenewalError?: string | null;
  renewedUntil?: string | null;
  renewalCheckoutSessionId?: string | null;
  activeRenewalOrderId?: string | null;
  providerRenewalCost?: number | null;
  customerRenewalPrice?: number | null;
  markupAmount?: number | null;
  currency?: string | null;
  tld?: string | null;
  priceCalculatedAt?: string | null;
  quoteExpiresAt?: string | null;
  failureCode?: string | null;
  remindersSent?: number[];
};
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

  renewal?: DomainRenewalInfo;
  renewalQuote?: DomainRenewalQuote;
  daysUntilExpiry?: number | null;
  uiCta?: DomainRenewalUiCta;

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

export async function createDomainContact(
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

/** @deprecated Use createDomainContact — kept for older imports. */
export const createOteDomainContact = createDomainContact;

export type DomainRegisterPayload = {
  registrationId: string;
  period?: number;
  stripeSessionId?: string;
};

export type DomainRegisterResult = {
  success: boolean;
  alreadyRegistered?: boolean;
  environment?: DomainEnvironment;
  message?: string;
  registrationId?: string;
  domain?: string;
  status?: DomainRegistrationStatus;
  contactHandle?: string;
  quote?: {
    total: number;
    currency?: string | null;
  } | null;
  registration?: {
    period?: number;
    expirationDate?: string | null;
    registeredAt?: string | null;
    failedAt?: string | null;
    error?: string | null;
  };
  process?: {
    id?: string | number | null;
    status?: string | number | null;
  };
  error?: string;
  errorType?: string;
};

export type DomainYears = 1 | 2 | 3 | 5 | 10;

export type DomainQuoteResult = {
  success: boolean;
  registrationId?: string;
  domain?: string;
  years: number;
  periodMonths?: number;
  price: number;
  originalPrice?: number;
  freeYearApplied?: boolean;
  freeDomainAvailable?: boolean;
  currency: string;
  options?: number[];
  error?: string;
};

export type DomainCheckoutResult = {
  success: boolean;
  alreadyRegistered?: boolean;
  freeYearApplied?: boolean;
  paymentUrl?: string;
  lowProfileCode?: string;
  registrationId?: string;
  domain?: string;
  years?: number;
  price?: number;
  originalPrice?: number;
  currency?: string;
  provider?: string;
  status?: DomainRegistrationStatus;
  error?: string;
};

export async function estimateDomainRegistration(payload: {
  domain: string;
  years: DomainYears;
}): Promise<DomainQuoteResult> {
  const domain = String(payload.domain || "").trim().toLowerCase();
  if (!domain) {
    throw new Error("חסר דומיין להערכת מחיר");
  }

  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/estimate`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({
        domain,
        years: payload.years,
      }),
    },
  );

  const data = await readJson<DomainQuoteResult>(response);
  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(response, data, "הערכת מחיר הדומיין נכשלה"),
    );
  }
  const price = Number(data.price);
  if (!(price > 0) && !data.freeYearApplied) {
    throw new Error("הערכת מחיר הדומיין החזירה מחיר לא תקין");
  }
  return data;
}

export async function quoteDomainRegistration(payload: {
  registrationId: string;
  years: DomainYears;
  vatNumber?: string;
}): Promise<DomainQuoteResult> {
  const registrationId = String(payload.registrationId || "").trim();
  if (!registrationId) {
    throw new Error("חסר מזהה רישום");
  }

  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/quote`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({
        registrationId,
        years: payload.years,
        vatNumber: payload.vatNumber || undefined,
      }),
    },
  );

  const data = await readJson<DomainQuoteResult>(response);
  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(response, data, "קבלת מחיר הדומיין נכשלה"),
    );
  }
  return data;
}

export async function checkoutDomainRegistration(payload: {
  registrationId: string;
  years: DomainYears;
  vatNumber?: string;
}): Promise<DomainCheckoutResult> {
  const registrationId = String(payload.registrationId || "").trim();
  if (!registrationId) {
    throw new Error("חסר מזהה רישום");
  }

  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/checkout`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({
        registrationId,
        years: payload.years,
        vatNumber: payload.vatNumber || undefined,
      }),
    },
  );

  const data = await readJson<DomainCheckoutResult>(response);
  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(response, data, "יצירת תשלום לדומיין נכשלה"),
    );
  }
  return data;
}

export async function registerDomain(
  payload: DomainRegisterPayload,
): Promise<DomainRegisterResult> {
  const registrationId = String(
    payload.registrationId || "",
  ).trim();

  if (!registrationId) {
    throw new Error(
      "חסר מזהה רישום. צרו איש קשר לפני רישום הדומיין",
    );
  }

  const response = await fetch(
    `${API_BASE}/api/domains/realtime-register/register`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({
        registrationId,
        stripeSessionId: payload.stripeSessionId || undefined,
      }),
    },
  );

  const data =
    await readJson<DomainRegisterResult>(response);

  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(
        response,
        data,
        "רישום הדומיין נכשל",
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

export type DomainRenewalCheckoutResult = {
  success: boolean;
  url?: string;
  checkoutUrl?: string;
  sessionId?: string;
  orderId?: string;
  orderNumber?: string;
  resumed?: boolean;
  customerRenewalPrice?: number;
  currency?: string;
  quoteExpiresAt?: string | null;
  error?: string;
  code?: string;
  quote?: DomainRenewalQuote | null;
};

export type DomainRenewalRetryResult = {
  success: boolean;
  renewed?: boolean;
  alreadyRenewed?: boolean;
  orderId?: string;
  fulfillmentStatus?: string | null;
  registration?: DomainRegistration | null;
  error?: string;
  code?: string;
};

export async function createDomainRenewalCheckout(
  domainId: string,
): Promise<DomainRenewalCheckoutResult> {
  const id = String(domainId || "").trim();
  if (!id) {
    throw new Error("חסר מזהה דומיין לחידוש");
  }

  const response = await fetch(
    `${API_BASE}/api/domains/${encodeURIComponent(id)}/create-renewal-checkout`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify({}),
    },
  );

  const data = await readJson<DomainRenewalCheckoutResult>(response);

  if (!response.ok || !data?.success) {
    const err = new Error(
      getApiErrorMessage(response, data, "יצירת תשלום לחידוש הדומיין נכשלה"),
    ) as Error & { code?: string; quote?: DomainRenewalQuote | null };
    err.code = data?.code || undefined;
    err.quote = data?.quote || null;
    throw err;
  }

  return {
    ...data,
    checkoutUrl: data.url || data.checkoutUrl,
  };
}

export async function retryDomainRenewal(
  domainId: string,
  orderId?: string,
): Promise<DomainRenewalRetryResult> {
  const id = String(domainId || "").trim();
  if (!id) {
    throw new Error("חסר מזהה דומיין לניסיון חידוש מחדש");
  }

  const response = await fetch(
    `${API_BASE}/api/domains/${encodeURIComponent(id)}/retry-renewal`,
    {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(true),
      body: JSON.stringify(orderId ? { orderId } : {}),
    },
  );

  const data = await readJson<DomainRenewalRetryResult>(response);

  if (!response.ok || !data?.success) {
    throw new Error(
      getApiErrorMessage(response, data, "ניסיון החידוש מחדש נכשל"),
    );
  }

  return data;
}
