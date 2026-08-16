import API from "../api";

export const PLUGIN_INSTALL_PLAN: Record<string, string> = {
  "smart-forms": "smart_forms_pro_monthly_29_ils",
  "exit-popup": "exit_popup_basic_monthly_15_ils",
  "analytics-pro": "analytics_pro_monthly_39_ils",
  "seo-pro": "seo_pro_monthly_29_ils",
  "multi-language": "multi_language_monthly_39_ils",
  "refer-a-friend": "refer_a_friend_monthly_29_ils",
  "birthday-club": "birthday_club_monthly_19_ils",
  countdown: "countdown_monthly_15_ils",
  "faq-pro": "faq_pro_monthly_19_ils",
  "social-proof": "social_proof_monthly_19_ils",
  "floating-contact-bar": "floating_contact_bar_monthly_15_ils",
  "form-to-pdf": "form_to_pdf_monthly_29_ils",
};

export const PLUGIN_PRO_PLAN: Record<string, string> = {
  "whatsapp-float": "whatsapp_pro_monthly_29_ils",
  "exit-popup": "exit_popup_pro_monthly_29_ils",
  "qr-generator": "qr_pro_monthly_19_ils",
};

export async function createPluginCheckout(planKey: string, siteId?: string) {
  const { data } = await API.post("/plugin-billing/checkout", {
    planKey,
    siteId: siteId || undefined,
  });
  return data as {
    ok: boolean;
    url?: string;
    sessionId?: string;
    upgraded?: boolean;
    amountIls?: number;
    currency?: string;
    interval?: string;
    addonKey?: string;
    tier?: string;
  };
}

export async function startPluginCheckout(addonKey: string, siteId?: string, tier: "basic" | "pro" = "basic") {
  const planKey =
    tier === "pro"
      ? PLUGIN_PRO_PLAN[addonKey] || PLUGIN_INSTALL_PLAN[addonKey]
      : PLUGIN_INSTALL_PLAN[addonKey] || PLUGIN_PRO_PLAN[addonKey];
  if (!planKey) throw new Error("No billing plan for addon");
  const result = await createPluginCheckout(planKey, siteId);
  if (result?.url && typeof window !== "undefined") {
    window.location.assign(result.url);
  }
  return result;
}

export function isPluginCheckoutRequiredError(error: unknown): boolean {
  const anyErr = error as {
    status?: number;
    response?: { status?: number; data?: { code?: string; checkoutRequired?: boolean } };
  };
  const status = anyErr.response?.status ?? anyErr.status;
  const code = String(anyErr.response?.data?.code || "");
  return (
    status === 402 ||
    code === "PLUGIN_ENTITLEMENT_REQUIRED" ||
    Boolean(anyErr.response?.data?.checkoutRequired)
  );
}
