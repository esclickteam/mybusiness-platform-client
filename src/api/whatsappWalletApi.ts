import API from "../api";
import { assertAutomationWritesAllowed } from "./automationPreviewGuard";

export type WhatsAppFundsOverview = {
  billingModel: "prepaid_wallet";
  unitPriceIls: number;
  unitPriceAgorot: number;
  funds: {
    businessId: string;
    currency: string;
    balanceMinor: number;
    reservedMinor: number;
    availableMinor: number;
    status: string;
    unitPriceMinor: number;
    autoFundingEnabled: boolean;
    autoFundingAmountMinor: number | null;
    autoFundingInterval: string;
    autoFundingStatus: string;
    autoFundingCancelAtPeriodEnd: boolean;
    nextAutoFundingAt: string | null;
    lowBalanceThresholdMinor: number;
    lowBalance: boolean;
    canSend: boolean;
    testMode: boolean;
  };
  alerts: {
    lowBalance: boolean;
    cannotSend: boolean;
    autoFundingFailed: boolean;
  };
  quickTopupAmountsMinor: number[];
  minTopupMinor: number;
  autoFundingPresetsMinor: number[];
  lowBalancePresetsMinor: number[];
};

function withBusiness(businessId: string) {
  return { params: { businessId } };
}

export async function getWhatsAppFunds(businessId: string) {
  const { data } = await API.get(
    "/whatsapp/billing/funds",
    withBusiness(businessId)
  );
  return data as WhatsAppFundsOverview & { success?: boolean; ok?: boolean };
}

export async function createWhatsAppWalletTopup(
  businessId: string,
  amountMinor: number,
  options?: { returnPath?: string }
) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/funds/topup",
    {
      amountMinor,
      returnPath: options?.returnPath,
    },
    withBusiness(businessId)
  );
  return data as {
    ok: boolean;
    url?: string;
    checkoutUrl?: string;
    intentId: string;
    amountMinor: number;
  };
}

export async function getWhatsAppTopupIntent(
  businessId: string,
  intentId: string
) {
  const { data } = await API.get(
    `/whatsapp/billing/funds/topup/${encodeURIComponent(intentId)}`,
    withBusiness(businessId)
  );
  return data;
}

export async function updateWhatsAppLowBalanceThreshold(
  businessId: string,
  thresholdMinor: number
) {
  assertAutomationWritesAllowed();
  const { data } = await API.patch(
    "/whatsapp/billing/funds/low-balance-threshold",
    { thresholdMinor },
    withBusiness(businessId)
  );
  return data;
}

export async function startWhatsAppAutoFunding(
  businessId: string,
  amountMinor: number,
  options?: { returnPath?: string }
) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/funds/auto-funding/checkout",
    { amountMinor, returnPath: options?.returnPath },
    withBusiness(businessId)
  );
  return data as {
    ok: boolean;
    url?: string;
    checkoutUrl?: string;
    intentId: string;
    amountMinor: number;
  };
}

export async function cancelWhatsAppAutoFunding(businessId: string) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/funds/auto-funding/cancel",
    {},
    withBusiness(businessId)
  );
  return data;
}

export async function resumeWhatsAppAutoFunding(businessId: string) {
  assertAutomationWritesAllowed();
  const { data } = await API.post(
    "/whatsapp/billing/funds/auto-funding/resume",
    {},
    withBusiness(businessId)
  );
  return data;
}

export function formatIlsFromMinor(minor: number) {
  const n = Math.round(Number(minor) || 0) / 100;
  return `₪${n.toLocaleString("he-IL", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
