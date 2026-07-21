import API from "../api";

export type MorningInvoiceSettings = {
  isEnabled: boolean;
  mode: "test" | "live";
  apiKeyId: string;
  hasApiSecret: boolean;
  apiSecretPreview?: string;
  autoIssueOnPaid: boolean;
  documentType: number;
  paymentType: number;
  vatType: number;
  currency: string;
  lang: string;
  sendByEmail: boolean;
  connectionStatus: "not_connected" | "pending" | "connected" | "failed";
  lastConnectionCheckAt?: string | null;
  lastError?: string;
};

export async function getMorningInvoiceSettings(businessId: string) {
  const { data } = await API.get(`/store/${businessId}/invoices/morning`);
  return (data?.settings || {}) as MorningInvoiceSettings;
}

export async function saveMorningInvoiceSettings(
  businessId: string,
  payload: Partial<MorningInvoiceSettings> & { apiSecret?: string }
) {
  const { data } = await API.put(`/store/${businessId}/invoices/morning`, payload);
  return (data?.settings || {}) as MorningInvoiceSettings;
}

export async function testMorningConnection(businessId: string) {
  const { data } = await API.post(
    `/store/${businessId}/invoices/morning/test-connection`
  );
  return data as {
    success: boolean;
    message?: string;
    businessName?: string;
    settings?: MorningInvoiceSettings;
  };
}

export async function issueMorningInvoiceForOrder(
  businessId: string,
  orderId: string
) {
  const { data } = await API.post(
    `/store/${businessId}/invoices/morning/issue/${orderId}`
  );
  return data;
}
