import API from "../api";

export type SitePaymentProviderKey =
  | "hyp"
  | "paypal"
  | "payme"
  | "grow"
  | "payplus"
  | "tranzila"
  | "cal"
  | "manual"
  | "whatsapp"
  | "bank_transfer"
  | "stripe"
  | "custom"
  | string;

export type SitePaymentCredentials = {
  terminalNumber?: string;
  username?: string;
  apiKey?: string;
  apiSecret?: string;
  pageCode?: string;
  supplierId?: string;
  merchantId?: string;
  accountId?: string;
  publicKey?: string;
  privateKey?: string;
  webhookSecret?: string;
  customCheckoutUrl?: string;
};

export type SitePaymentProvider = {
  _id?: string;
  provider: SitePaymentProviderKey;
  label?: string;
  isEnabled?: boolean;
  isPrimary?: boolean;
  mode?: "test" | "live";
  installmentsEnabled?: boolean;
  credentials?: SitePaymentCredentials;
  /** Server-side flags: which credential keys are stored (values themselves are masked). */
  credentialsMeta?: Partial<Record<keyof SitePaymentCredentials, boolean>>;
  connectionStatus?: "not_connected" | "pending" | "connected" | "failed";
  lastConnectionCheckAt?: string | null;
  notes?: string;
};

export type SitePaymentProvidersResponse = {
  providers: SitePaymentProvider[];
  paymentMethods: string[];
  defaultPaymentProvider: string;
};

const MASKED = "••••••••";

const MASKABLE_CREDENTIAL_KEYS: (keyof SitePaymentCredentials)[] = [
  "terminalNumber",
  "supplierId",
  "apiKey",
  "apiSecret",
  "privateKey",
  "webhookSecret",
  "username",
];

function stripMaskedSecrets(
  credentials: SitePaymentCredentials = {}
): SitePaymentCredentials {
  const next: SitePaymentCredentials = { ...credentials };

  MASKABLE_CREDENTIAL_KEYS.forEach((key) => {
    const value = String(next[key] || "").trim();
    if (!value || value === MASKED) {
      delete next[key];
    }
  });

  return next;
}

export function credentialFieldIsStored(
  provider: SitePaymentProvider | null | undefined,
  key: keyof SitePaymentCredentials
): boolean {
  if (provider?.credentialsMeta && typeof provider.credentialsMeta[key] === "boolean") {
    return Boolean(provider.credentialsMeta[key]);
  }
  const value = String(provider?.credentials?.[key] || "").trim();
  return Boolean(value);
}

export function providerHasStoredSecret(
  provider?: SitePaymentProvider | null
): boolean {
  return (
    credentialFieldIsStored(provider, "apiSecret") ||
    credentialFieldIsStored(provider, "apiKey") ||
    credentialFieldIsStored(provider, "terminalNumber") ||
    credentialFieldIsStored(provider, "privateKey") ||
    credentialFieldIsStored(provider, "webhookSecret")
  );
}

export async function getSitePaymentProviders(businessId: string) {
  const { data } = await API.get(`/store/${businessId}/payments/providers`);
  return data as SitePaymentProvidersResponse;
}

export async function saveSitePaymentProvider(
  businessId: string,
  payload: SitePaymentProvider
) {
  const body: SitePaymentProvider = {
    ...payload,
    credentials: stripMaskedSecrets(payload.credentials || {}),
  };

  const { data } = await API.put(
    `/store/${businessId}/payments/provider`,
    body
  );

  return data as {
    success: boolean;
    provider?: SitePaymentProvider;
    settings?: { paymentProviders?: SitePaymentProvider[] };
  };
}

export async function deleteSitePaymentProvider(
  businessId: string,
  provider: string
) {
  const { data } = await API.delete(
    `/store/${businessId}/payments/provider/${provider}`
  );
  return data as {
    success: boolean;
    settings?: { paymentProviders?: SitePaymentProvider[] };
  };
}

export async function testSitePaymentProviderConnection(
  businessId: string,
  provider: string
) {
  const { data } = await API.post(
    `/store/${businessId}/payments/test-connection`,
    { provider }
  );
  return data as {
    success: boolean;
    message?: string;
    provider?: SitePaymentProvider;
  };
}
