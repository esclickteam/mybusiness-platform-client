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

export type PartnerComplianceDocument = {
  url: string;
  mime?: string;
  originalName?: string;
  uploadedAt?: string | null;
} | null;

export type PartnerCompliance = {
  accountHolderName: string;
  idNumber: string;
  taxNumber: string;
  phone: string;
  bankName: string;
  branch: string;
  account: string;
  documents: {
    accountManagementAuth: PartnerComplianceDocument;
    dealerCertificate: PartnerComplianceDocument;
    idPhoto: PartnerComplianceDocument;
  };
  documentLabels?: Record<string, string>;
  fieldLabels?: Record<string, string>;
  reviewStatus: "incomplete" | "submitted" | "approved" | "rejected";
  adminFeedback?: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  missing?: string[];
  complete?: boolean;
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
  urls?: {
    slugUrl?: string;
    plansUrl?: string;
    subdomainUrl?: string;
    personalUrl?: string;
  };
  billingCheckoutAvailable?: boolean;
  storefront?: Record<string, unknown>;
  compliance?: PartnerCompliance;
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
  oneTimeMarkupEnabled?: boolean;
  oneTimeMarkupAmount?: number;
  recurringMarkupEnabled?: boolean;
  recurringMarkupAmount?: number;
  baseOneTimeAmount?: number;
  baseRecurringAmount?: number;
  partnerOneTimeMarkup?: number;
  partnerRecurringMarkup?: number;
  customerOneTimeAmount?: number;
  customerRecurringAmount?: number;
  customerFinalPrice: number;
  partnerMarkupShare: number;
  bizuplyMarkupShare: number;
  oneTimePartnerShare?: number;
  recurringPartnerShare?: number;
  partnerShareRate?: number;
  bizuplyShareRate?: number;
  additionalCommission?: number;
  partnerCostToBizuply?: number;
  discountRate?: number;
  enabledInStorefront?: boolean;
  visibleOnSalesPage?: boolean;
  descriptionHe?: string;
  uxCategory?: string;
  isMainPackage?: boolean;
  packageGroup?: string | null;
  packageInterval?: string | null;
  displayNameHe?: string;
  taglineHe?: string;
  includedHe?: string[];
  dependsOn?: string[];
  websiteRequired?: boolean;
};

export type PartnerWizardCategory = {
  id: string;
  labelHe: string;
  items: PartnerPriceLine[];
};

export type PartnerWizardCatalog = {
  packages: PartnerPriceLine[];
  categories: PartnerWizardCategory[];
  featureLabels?: Record<string, string>;
  coveredByPackage?: Record<string, string[]>;
};

export type PartnerDealTotals = {
  oneTime: number;
  monthly: number;
  annual: number;
  customerNow: number;
  partnerPaysBizuply: number;
  partnerCommission: number;
  bizuplyShare: number;
  wholesale: number;
  oneTimeCommission?: number;
  monthlyCommission?: number;
  partnerOneTimeCommission?: number;
  partnerMonthlyCommission?: number;
  bizuplyOneTimeShare?: number;
  bizuplyMonthlyShare?: number;
};

export type PartnerDeal = {
  _id: string;
  dealId?: string;
  dealNumber: string;
  status: string;
  paymentStatus?: string;
  activationStatus?: string;
  commissionStatus?: string;
  salesSource?: string;
  pipelineStatus?: string;
  needsAttention?: boolean;
  welcomeNeedsResend?: boolean;
  welcomeSendInFlight?: boolean;
  activationInFlight?: boolean;
  kind?: string;
  packageSku?: string;
  packageDisplayName?: string;
  packageDescription?: string;
  logoUrl?: string;
  additionalMarkup?: number;
  oneTimeCommission?: number;
  monthlyCommission?: number;
  partnerIncomeOneTime?: number;
  partnerIncomeRecurring?: number;
  recurringIncomeActive?: boolean;
  lines: PartnerPriceLine[];
  totals: PartnerDealTotals;
  currency?: string;
  partnerPlanKey?: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeSubscriptionId?: string;
  stripeInvoiceId?: string;
  publicUrl?: string;
  paidAt?: string | null;
  createdAt?: string;
  clientProvisioning?: {
    status?: string;
    email?: string;
    userId?: string | null;
    existingUserId?: string | null;
    existingBusinessId?: string | null;
    existingBusinessClaimable?: boolean;
    welcomeEmailSent?: boolean;
    welcomeEmailSentAt?: string | null;
    welcomeEmailSendingAt?: string | null;
    temporaryPasswordIssuedAt?: string | null;
    error?: string;
  } | null;
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
  source?: string;
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
  eligibleCommission?: number | null;
  paidCommission?: number | null;
  transactionCount?: number | null;
  oneTimeSales?: number | null;
  recurringCollected?: number | null;
  oneTimeCommission?: number | null;
  recurringCommission?: number | null;
  referralCommission?: number | null;
  commissionMrr?: number | null;
};

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
  attentionDeals?: PartnerDeal[];
  referrals?: {
    qualifying?: Array<{
      _id: string;
      referredName?: string;
      daysActive?: number;
      qualificationDays?: number;
      eligibleAt?: string | null;
      rewardAmount?: number;
    }>;
    posted?: number;
    cancelled?: number;
  };
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
