const RAW_API_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.bizuply.com",
).trim();

/**
 * תומך בשני המצבים:
 *
 * VITE_API_URL=https://api.bizuply.com
 * VITE_API_URL=https://api.bizuply.com/api
 *
 * בשני המקרים נקבל בסיס נקי:
 * https://api.bizuply.com
 */
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

export async function checkDomainAvailability(
  value: string,
): Promise<DomainAvailabilityResult> {
  const domain = normalizeDomain(value);

  if (!isValidDomain(domain)) {
    throw new Error(
      "יש להזין דומיין תקין, לדוגמה mybusiness.co.il",
    );
  }

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token") || ""
      : "";

  const requestUrl =
    `${API_BASE}/api/domains/realtime-register/check` +
    `?domain=${encodeURIComponent(domain)}`;

  console.log("[Domain Search] Request:", requestUrl);

  const response = await fetch(requestUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  const data = (await response.json().catch(() => null)) as
    | DomainAvailabilityResult
    | null;

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "נתיב בדיקת הדומיין לא נמצא בשרת. ודאו שה־route עלה ל־Railway.",
      );
    }

    if (response.status === 401) {
      throw new Error(
        "אין הרשאה לבצע בדיקת דומיין. התחברו מחדש ונסו שוב.",
      );
    }

    throw new Error(
      data?.error ||
        `בדיקת זמינות הדומיין נכשלה (${response.status})`,
    );
  }

  if (!data?.success) {
    throw new Error(
      data?.error || "בדיקת זמינות הדומיין נכשלה",
    );
  }

  return data;
}