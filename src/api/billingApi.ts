import API from "../api";

export type BillingOverview = {
  summary: {
    primaryPlanName: string | null;
    primaryPlanStatus: string | null;
    hasActivePlan: boolean;
    nextChargeAmount: number | null;
    nextChargeDate: string | null;
    totalPaid: number;
    currency: string;
    activeSubscriptionsCount: number;
    activeServicesCount: number;
    pendingAttentionCount: number;
    trialAccess: { endsAt: string | null; active: boolean } | null;
  };
  primaryPlan: {
    sku: string;
    name: string;
    priceIls: number;
    currency: string;
    billingType: string | null;
    status: string | null;
    start: string | null;
    end: string | null;
    nextBillingDate: string | null;
    cancelAtPeriodEnd: boolean;
    cancelScheduledAt: string | null;
    stripeSubscriptionIdMasked: string | null;
    actions: {
      canCancelRenewal: boolean;
      canResume: boolean;
      canUpgrade: boolean;
      canRenewWebsite: boolean;
    };
    purchaseId: string | null;
    lineItems: Array<{
      sku: string;
      name: string;
      kind: string;
      billing: string;
      amountIls: number;
      quantity: number;
    }>;
  } | null;
  websiteAccess: {
    accessUntil: string | null;
    start: string | null;
    purchasedAt: string | null;
    billingInterval: string;
    renewalType: string;
    autoRenew: boolean;
    noAutoRenew: boolean;
    canRenewForAnotherYear: boolean;
  } | null;
  serviceOrders: Array<{
    id: string;
    orderNumber: string;
    serviceKey: string;
    serviceName: string;
    category: string;
    billingType: string;
    pricePaidIls: number;
    currency: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    serviceStatus: string;
    purchasedAt: string | null;
    startedAt: string | null;
    nextRenewalAt: string | null;
    endedAt: string | null;
    cancelAtPeriodEnd: boolean;
    parentPurchaseId: string | null;
    purchaseMode: string;
    assignedTo: { id: string; name: string | null } | null;
    actions: {
      canCancelRenewal: boolean;
      canRepurchase: boolean;
      canContactSupport: boolean;
    };
  }>;
  domains: Array<{
    id: string;
    domain: string;
    registeredAt: string | null;
    expiresAt: string | null;
    daysRemaining: number | null;
    status: string;
    renewalStatus: string;
    lastRenewalPrice: number | null;
    quoteExpiresAt: string | null;
    renewalPaid: boolean;
    renewalInProgress: boolean;
    renewalSucceeded: boolean;
    quoteRequired: boolean;
    activeRenewalOrderId: string | null;
    cta: string;
  }>;
  upcomingCharges: Array<{
    id: string;
    name: string;
    amount: number;
    currency: string;
    chargeAt: string | null;
    frequency: string;
    status: string;
    cancelScheduled: boolean;
    kind: string;
    note?: string;
  }>;
  paymentHistory: Array<{
    id: string;
    source: string;
    date: string | null;
    transactionId: string;
    description: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string | null;
    invoiceNumber: string | null;
    billingPeriod: { start?: string | null; end?: string | null } | null;
    receiptUrl: string | null;
    canRetry: boolean;
    refundStatus: string;
    refundedAmount: number;
    billingKind?: string;
    needsRefundReview?: boolean;
  }>;
  failedPayments: Array<{
    id: string;
    description: string;
    amount: number;
    currency: string;
    date: string | null;
    status: string;
    attemptCount?: number;
    updatePaymentMethod?: boolean;
    canRetry?: boolean;
    type?: string;
  }>;
  refunds: Array<{
    id: string;
    description: string;
    amount: number;
    currency: string;
    date: string | null;
    status: string;
    refundKind: string;
    refundedAmount?: number;
  }>;
};

export async function fetchBillingOverview(
  businessId: string
): Promise<BillingOverview> {
  const { data } = await API.get<BillingOverview>("/billing/overview", {
    params: { businessId },
  });
  return data;
}

export async function cancelSubscription(): Promise<void> {
  await API.post("/stripe/cancel-subscription", {});
}

export async function resumeSubscription(): Promise<void> {
  await API.post("/stripe/resume-subscription", {});
}
