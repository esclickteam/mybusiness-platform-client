export type PartnerPlanKey = "partner_basic" | "partner_pro" | "partner_premium";

export type PartnerStatus =
  | "pending_setup"
  | "active"
  | "payment_due"
  | "suspended"
  | "cancelled";

export type PartnerClientStatus =
  | "lead"
  | "waiting_payment"
  | "provisioning"
  | "active"
  | "payment_issue"
  | "suspended"
  | "cancelled";

export type PartnerPermission =
  | "view_clients"
  | "create_clients"
  | "edit_clients"
  | "manage_subscriptions"
  | "manage_pricing"
  | "manage_permissions"
  | "view_financial_reports"
  | "manage_storefront"
  | "manage_partner_settings";

export type ManagementMode = "partner" | "customer" | "shared";

export type PartnerPlan = {
  planKey: PartnerPlanKey;
  nameHe: string;
  nameEn: string;
  setupIls: number;
  monthlyIls: number;
  softwareDiscountCap: number;
  humanServiceDiscountCap: number;
  aiDiscountCap: number;
  whatsappDiscountCap: number;
  partnerMarkupShare: number;
  additionalTeamUsers: number;
  customDomainEligible: boolean;
  canHideBizuplyBranding: boolean;
};

export type PartnerMe = {
  partnerId: string;
  name: string;
  slug: string;
  planKey: PartnerPlanKey;
  plan?: PartnerPlan;
  status: PartnerStatus;
  setupFeeStatus?: string;
  subscriptionStatus?: string;
  currentPeriodEnd?: string | null;
  lastPaymentAt?: string | null;
  nextRenewalAt?: string | null;
  branding?: Record<string, unknown>;
  storefront?: Record<string, unknown>;
  teamSeatLimit: number;
  membership: {
    membershipId: string;
    role: "owner" | "member";
    status?: "active" | "revoked";
    permissions: PartnerPermission[];
  };
};

export type PartnerPriceLine = {
  sku: string;
  nameHe?: string;
  nameEn?: string;
  billing?: string;
  category?: string;
  retailPrice?: number;
  retailIls?: number;
  partnerWholesalePrice: number;
  markup?: number;
  markupIls?: number;
  customerFinalPrice: number;
  partnerMarkupShare: number;
  bizuplyMarkupShare: number;
  partnerShareRate?: number;
  bizuplyShareRate?: number;
  additionalCommission?: number;
  partnerCostToBizuply?: number;
  discountRate?: number;
  enabledInStorefront?: boolean;
  descriptionHe?: string;
};

export type PartnerClientContact = {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  country?: string;
  taxNumber?: string;
  notes?: string;
};

export type PartnerNote = {
  _id?: string;
  text: string;
  createdAt?: string;
};

export type PartnerTask = {
  _id?: string;
  title: string;
  dueAt?: string | null;
  done?: boolean;
  createdAt?: string;
};

export type PartnerClient = {
  _id: string;
  partnerId: string;
  businessId?: string | null;
  contact: PartnerClientContact;
  status: PartnerClientStatus;
  managementMode: ManagementMode;
  selectedSkus: PartnerPriceLine[];
  mrrCustomer?: number;
  mrrWholesale?: number;
  paymentStatus?: string;
  notes?: PartnerNote[];
  tasks?: PartnerTask[];
  createdAt?: string;
  updatedAt?: string;
  activatedAt?: string | null;
  joinedAt?: string | null;
  nextBillingDate?: string | null;
  enabledEntitlements?: string[];
  canEnterClient?: boolean;
  partnerShareRate?: number;
  bizuplyShareRate?: number;
};

export type PartnerSubscriptionSnapshot = {
  planKey?: PartnerPlanKey | string | null;
  planName?: string | null;
  monthlyFeeIls?: number | null;
  monthlyStatus?: "active" | "inactive";
  currentMonthPayment?: "paid" | "unpaid";
  currentPeriodKey?: string;
  setupFeeIls?: number | null;
  setupPayment?: "paid" | "unpaid" | "waived";
  openSubscriptionDebtIls?: number;
  teamSeatLimit?: number | null;
  softwareDiscountCap?: number | null;
  partnerMarkupShare?: number | null;
  bizuplyMarkupShare?: number | null;
};

export type AmountDue = {
  amountDueToBizuply: number;
  clientUsageDebtIls?: number;
  openPartnerSubscriptionDebtIls?: number;
  totalAmountDueToBizuply?: number;
  overdue?: boolean;
  breakdown: {
    monthlySubscription: number;
    unpaidSetupFee: number;
    postedMonthlySubscription?: number;
    postedSetupFee?: number;
    wholesaleSubscriptions: number;
    bizuplyMarkupShare: number;
    usage: number;
    addOns: number;
    adjustments: number;
    payments: number;
    partnerPlanPayments?: number;
  };
  partnerSubscription?: PartnerSubscriptionSnapshot;
};

export type PartnerDashboardMetrics = {
  openTasks: number;
  customerMrr: number | null;
  totalSales?: number | null;
  partnerCommission?: number | null;
  pendingCommission?: number | null;
  paidCommission?: number | null;
  transactionCount?: number | null;
};

export type PartnerDashboardPayload = {
  partner: PartnerMe;
  partnerSubscription?: PartnerSubscriptionSnapshot | null;
  openPartnerSubscriptionDebtIls?: number | null;
  wholesaleDebtIls?: number | null;
  range?: {
    preset?: string;
    from?: string;
    to?: string;
    granularity?: string;
  } | null;
  chart?: Array<{ bucket: string; sales: number; commission: number }>;
  breakdown?: AmountDue["breakdown"] | null;
  clients: {

export type PartnerDashboardActivity = {
  _id: string;
  entryType: string;
  label: string;
  sku?: string;
  amountIls: number;
  description?: string;
  createdAt?: string;
};

export type PartnerDashboardPayload = {
  partner: PartnerMe;
  amountDueToBizuply?: number | null;
  clientUsageDebtIls?: number | null;
  openPartnerSubscriptionDebtIls?: number | null;
  wholesaleDebtIls?: number | null;
  totalAmountDueToBizuply?: number | null;
  partnerSubscription?: PartnerSubscriptionSnapshot | null;
  breakdown?: AmountDue["breakdown"] | null;
  range?: { preset?: string; from?: string; to?: string; granularity?: string } | null;
  chart?: Array<{ bucket: string; sales: number; commission: number }>;
  clients: {
    total: number;
    active: number;
    waitingPayment: number;
    leads: number;
    paymentIssue?: number;
    suspended?: number;
  };
  metrics?: PartnerDashboardMetrics;
  recentClients?: PartnerClient[];
  recentActivity?: PartnerDashboardActivity[];
};

export type AdminPartnerRow = {
  partnerId: string;
  name: string;
  planKey: PartnerPlanKey;
  planName?: string;
  status: PartnerStatus;
  amountDueToBizuply?: number;
  totalCustomerSales?: number;
  commissionAccrued?: number;
  commissionPending?: number;
  commissionPaid?: number;
  commissionReversed?: number;
  customerMrr?: number;
  partnerSubscription?: PartnerSubscriptionSnapshot;
  clientUsageDebtIls?: number;
  openPartnerSubscriptionDebtIls?: number;
  totalAmountDueToBizuply?: number;
  overdueBalance?: number;
  activeDownstreamBusinesses: number;
  suspendedDownstreamBusinesses: number;
  currentWholesaleMrr?: number;
  bizuplyMarkupRevenue?: number;
  partnerMarkupTotal?: number;
  lastPayment?: { at?: string; amountIls?: number | null } | null;
  nextPartnerSubscriptionRenewal?: string | null;
  snapshotError?: string;
};
