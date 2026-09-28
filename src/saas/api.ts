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
  email: string;
  phone: string;
  country: string;
  message: string;
  pageUrl: string;
}) {
  const { data } = await API.post("/saas-marketplace/leads", body);
  return data as { success: boolean };
}

export async function startSaasCheckout(body: {
  slug: string;
  paymentType: "full" | "deposit";
  name?: string;
  email?: string;
}) {
  const { data } = await API.post("/saas-marketplace/checkout", body);
  return data as {
    success: boolean;
    checkoutUrl: string;
    orderToken: string;
  };
}

export async function fetchSaasOrderStatus(token: string) {
  const { data } = await API.get("/saas-marketplace/orders/status", {
    params: { token },
  });
  return data as {
    success: boolean;
    order: { status: string; productName: string; paymentType: string };
  };
}
