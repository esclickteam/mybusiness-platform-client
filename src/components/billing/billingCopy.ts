const PLAN_SKU_ALIASES: Record<string, string> = {
  monthly: "monthly",
  yearly: "yearly",
  website: "website",
  website_only: "website",
  crm_only: "crm_only",
  crm_only_monthly: "crm_only",
  earlybird: "earlybird",
  trial: "trial",
};

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

export type BillingCopySource = {
  sku?: string | null;
  kind?: string | null;
  productKey?: string | null;
  domainName?: string | null;
  type?: string | null;
  name?: string | null;
  description?: string | null;
};

function translatedOrEmpty(t: TranslateFn, key: string): string {
  const value = t(key);
  if (!value || value === key) return "";
  return value;
}

export function billingCheckoutErrorMessage(
  t: TranslateFn,
  code?: string | null,
  fallbackKey = "pricing.alertGenericError"
): string {
  if (code === "REGIONAL_PRICE_UNAVAILABLE") {
    return t("billing.regional.unavailable");
  }
  if (code === "PRICING_CONFIGURATION_ERROR") {
    return t("billing.errors.pricingConfiguration");
  }
  if (code === "SUBSCRIPTION_ALREADY_ACTIVE") {
    return t("billing.errors.subscriptionAlreadyActive");
  }
  if (code === "ADDON_REQUIRES_BUSINESS_PLAN") {
    return t("billing.errors.addonRequiresPlan");
  }
  if (code === "EMAIL_ALREADY_REGISTERED") {
    return t("register.emailExists");
  }
  return t(fallbackKey);
}

export function localizeBillingLabel(t: TranslateFn, item: BillingCopySource): string {
  const fallback = String(item.name || item.description || "").trim();

  if (item.kind === "website_manual_renewal") {
    return t("billing.upcoming.websiteRenewal", { defaultValue: fallback });
  }

  if (item.type === "domain_renewal" || item.kind === "domain_renewal") {
    const domain = String(item.domainName || "").trim();
    return t("billing.history.domainRenewal", {
      domain,
      defaultValue: fallback || domain,
    });
  }

  if (item.productKey) {
    const addon = translatedOrEmpty(t, `billing.addons.${item.productKey}`);
    if (addon) return addon;
  }

  const skuKey = PLAN_SKU_ALIASES[String(item.sku || "").trim()];
  if (skuKey) {
    return t(`billing.planNames.${skuKey}`, {
      defaultValue: fallback || skuKey,
    });
  }

  return fallback;
}
