import API from "../api";
import type { SaasCategory, SaasProduct } from "./logic";

export type MarketplaceSettings = {
  whatsappE164: string;
  usdToIlsRate: number;
  checkoutCurrency: string;
  listCurrency: string;
};

export type MarketplacePayload = {
  categories: SaasCategory[];
  settings: MarketplaceSettings;
  products: SaasProduct[];
};

export async function fetchMarketplace() {
  const { data } = await API.get("/saas-marketplace");
  return data as { success: boolean } & MarketplacePayload;
}

export async function fetchSaasProduct(slug: string) {
  const { data } = await API.get(`/saas-marketplace/${encodeURIComponent(slug)}`);
  return data as {
    success: boolean;
    settings: MarketplaceSettings;
    product: SaasProduct;
  };
}

export async function submitSaasLead(body: {
  slug: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  model: string;
  ctaSource: string;
  message: string;
  pageUrl: string;
}) {
  const { data } = await API.post("/saas-marketplace/leads", body);
  return data as { success: boolean };
}

export async function checkCountryAvailability(body: { slug: string; country: string }) {
  const { data } = await API.post("/saas-marketplace/country-availability", body);
  return data as { success: boolean; result: "review" | "assigned"; guaranteed: false };
}

/**
 * Sandbox-only purchase → provision. Requires server SAAS_CHECKOUT_MODE=sandbox.
 * Never use for live charges; live /checkout stays disabled until owner approval.
 */
export async function createSandboxSaasCheckout(body: {
  slug: string;
  name: string;
  email: string;
  businessName?: string;
  paymentType?: "full" | "deposit";
  autoProvision?: boolean;
}) {
  const { data } = await API.post("/saas-marketplace/sandbox-checkout", body);
  return data as {
    success: boolean;
    mode: "sandbox";
    provisioned: boolean;
    orderToken?: string;
    paymentId?: string;
    account?: {
      email?: string;
      tenantIds?: string[];
      passwordSetupUrl?: string | null;
      studioPathHint?: string | null;
    } | null;
    note?: string;
    code?: string;
    error?: string;
  };
}

