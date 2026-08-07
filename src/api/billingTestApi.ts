import API from "../api";

export type BillingTestMode = "test" | "live" | string;

export type BillingTestCatalogItem = {
  sku: string;
  kind?: string;
  nameHe?: string;
  nameEn?: string;
  amountIls?: number;
  billing?: string;
  descriptionHe?: string;
  active?: boolean;
  cycles?: string[];
  stripeLookupKey?: string;
  stripeTestPriceId?: string | null;
  stripeLivePriceId?: string | null;
};

export type BillingTestMatrixResponse = {
  mode?: BillingTestMode;
  available?: boolean;
  message?: string;
  badge?: string;
  packages?: BillingTestCatalogItem[];
  upsells?: BillingTestCatalogItem[];
  addons?: BillingTestCatalogItem[];
  items?: BillingTestCatalogItem[];
};

export type BillingTestCheckoutPayload = {
  packageSku: "monthly" | "yearly" | "website_only" | string;
  upsellSkus?: string[];
  addonSkus?: string[];
  businessId?: string;
  email?: string;
};

export type BillingTestCheckoutResponse = {
  url?: string;
  sessionId?: string;
  checkout?: { url?: string; sessionId?: string; id?: string };
  mode?: BillingTestMode;
  message?: string;
};

export type BillingTestVerifyCheck = {
  key?: string;
  id?: string;
  label?: string;
  name?: string;
  pass?: boolean;
  ok?: boolean;
  status?: "pass" | "fail" | string;
  detail?: string;
  message?: string;
};

export type BillingTestVerifyResponse = {
  pass?: boolean;
  ok?: boolean;
  sessionId?: string;
  mode?: BillingTestMode;
  checks?: BillingTestVerifyCheck[];
  checklist?: BillingTestVerifyCheck[];
  message?: string;
};

export type BillingTestMappingEntry = {
  sku?: string;
  lookupKey?: string;
  stripeLookupKey?: string;
  livePriceId?: string | null;
  testPriceId?: string | null;
  stripeLivePriceId?: string | null;
  stripeTestPriceId?: string | null;
  nameHe?: string;
  kind?: string;
};

export type BillingTestMappingResponse = {
  mode?: BillingTestMode;
  available?: boolean;
  mapping?: BillingTestMappingEntry[];
  items?: BillingTestMappingEntry[];
  message?: string;
};

function extractErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as {
    response?: { data?: { error?: string; message?: string } };
    message?: string;
  };
  return (
    anyErr?.response?.data?.error ||
    anyErr?.response?.data?.message ||
    anyErr?.message ||
    fallback
  );
}

export function isBillingTestAvailable(matrix?: BillingTestMatrixResponse | null) {
  if (!matrix) return false;
  if (typeof matrix.available === "boolean") return matrix.available;
  return String(matrix.mode || "").toLowerCase() === "test";
}

export function normalizeVerifyChecks(
  data?: BillingTestVerifyResponse | null
): Array<{ key: string; label: string; pass: boolean; detail: string }> {
  const raw = Array.isArray(data?.checks)
    ? data!.checks!
    : Array.isArray(data?.checklist)
      ? data!.checklist!
      : [];

  return raw.map((item, index) => {
    const key = String(item.key || item.id || `check_${index + 1}`);
    const label = String(item.label || item.name || key);
    const pass =
      typeof item.pass === "boolean"
        ? item.pass
        : typeof item.ok === "boolean"
          ? item.ok
          : String(item.status || "").toLowerCase() === "pass";
    const detail = String(item.detail || item.message || "");
    return { key, label, pass, detail };
  });
}

export async function fetchBillingTestMatrix() {
  try {
    const { data } = await API.get<BillingTestMatrixResponse>(
      "/admin/billing-test/matrix"
    );
    return data;
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 403 || status === 404) {
      const message = extractErrorMessage(
        err,
        "מטריצת בדיקות החיוב אינה זמינה במצב הנוכחי"
      );
      return {
        mode: "live",
        available: false,
        message,
        packages: [],
        upsells: [],
        addons: [],
      } satisfies BillingTestMatrixResponse;
    }
    throw new Error(
      extractErrorMessage(err, "שגיאה בטעינת מטריצת בדיקות החיוב")
    );
  }
}

export async function createBillingTestCheckout(
  payload: BillingTestCheckoutPayload
) {
  const { data } = await API.post<BillingTestCheckoutResponse>(
    "/admin/billing-test/checkout",
    payload
  );
  const url = data?.url || data?.checkout?.url || "";
  const sessionId =
    data?.sessionId ||
    data?.checkout?.sessionId ||
    data?.checkout?.id ||
    "";
  if (!url) {
    throw new Error(
      data?.message || "לא התקבל קישור Checkout ממצב הבדיקות"
    );
  }
  return { url, sessionId, raw: data };
}

export async function verifyBillingTestSession(sessionId: string) {
  const id = String(sessionId || "").trim();
  if (!id) throw new Error("חסר sessionId לאימות");
  const { data } = await API.post<BillingTestVerifyResponse>(
    `/admin/billing-test/verify/${encodeURIComponent(id)}`
  );
  return data;
}

export async function fetchBillingTestMapping() {
  const { data } = await API.get<BillingTestMappingResponse>(
    "/admin/billing-test/mapping"
  );
  return data;
}