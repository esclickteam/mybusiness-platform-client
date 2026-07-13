const RAW_API_URL = String(
  import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://api.bizuply.com",
).replace(/\/$/, "");

export type DomainAvailabilityResult = {
  success: boolean;
  environment?: "ote" | "production";
  domain: string;
  available?: boolean;
  premium?: boolean;
  currency?: string | null;
  price?: number | null;
  reason?: string | null;
  error?: string;
};

function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0];
}

export async function checkDomainAvailability(
  value: string,
): Promise<DomainAvailabilityResult> {
  const domain = normalizeDomain(value);

  if (!domain || !domain.includes(".")) {
    throw new Error("יש להזין דומיין תקין, לדוגמה bizuply.com");
  }

  const token = window.localStorage.getItem("token") || "";

  const response = await fetch(
    `${RAW_API_URL}/api/domains/realtime-register/check?domain=${encodeURIComponent(
      domain,
    )}`,
    {
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
    },
  );

  const data = (await response.json().catch(() => null)) as
    | DomainAvailabilityResult
    | null;

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.error || "בדיקת זמינות הדומיין נכשלה",
    );
  }

  return data;
}