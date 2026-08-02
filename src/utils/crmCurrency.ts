/**
 * CRM money formatting — Israeli businesses display Shekels (₪ / ILS).
 */

export type CrmMoneyFormat = {
  currency: string;
  locale: string;
};

const ILS: CrmMoneyFormat = {
  currency: "ILS",
  locale: "he-IL",
};

function cleanPhone(value?: string | null) {
  return String(value || "").replace(/[^\d+]/g, "");
}

export function detectCrmCurrency(user?: {
  business?: {
    currency?: string;
    country?: string;
    locale?: string;
    phone?: string;
  } | null;
  currency?: string;
  country?: string;
  locale?: string;
  phone?: string;
} | null): CrmMoneyFormat {
  const currency = String(
    user?.business?.currency || user?.currency || ""
  ).toUpperCase();
  const country = String(
    user?.business?.country || user?.country || ""
  ).toLowerCase();
  const locale = String(
    user?.business?.locale || user?.locale || ""
  ).toLowerCase();
  const phone = cleanPhone(user?.business?.phone || user?.phone || "");

  if (currency === "ILS" || currency === "NIS") return ILS;
  if (currency && currency !== "USD") {
    return {
      currency,
      locale: locale || "en-US",
    };
  }

  if (
    country === "israel" ||
    country === "il" ||
    locale.startsWith("he") ||
    phone.startsWith("972") ||
    phone.startsWith("+972") ||
    /^05\d{8}$/.test(phone)
  ) {
    return ILS;
  }

  // Platform default for this product is Israel / Shekels.
  return ILS;
}

/** Format an amount in Shekels (₪), e.g. ₪1,200 */
export function formatCrmMoney(
  value?: number | null,
  user?: Parameters<typeof detectCrmCurrency>[0]
) {
  const detected = detectCrmCurrency(user);
  const amount = Number(value || 0);

  try {
    return new Intl.NumberFormat(detected.locale, {
      style: "currency",
      currency: detected.currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    const formatted = amount.toLocaleString("he-IL");
    return `₪${formatted}`;
  }
}

export function formatShekels(value?: number | null) {
  return formatCrmMoney(value, null);
}
