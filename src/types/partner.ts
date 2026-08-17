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

export type AmountDue = {
  amountDueToBizuply: number;
  overdue?: boolean;
  breakdown: {
    monthlySubscription: number;
    unpaidSetupFee: number;
    wholesaleSubscriptions: number;
    bizuplyMarkupShare: number;
    usage: number;
    addOns: number;
    adjustments: number;
    payments: number;
  };
};

export type AdminPartnerRow = {
  partnerId: string;
  name: string;
  planKey: PartnerPlanKey;
  planName?: string;
  status: PartnerStatus;
  amountDueToBizuply: number;
  overdueBalance: number;
  activeDownstreamBusinesses: number;
  suspendedDownstreamBusinesses: number;
  currentWholesaleMrr: number;
  bizuplyMarkupRevenue: number;
  partnerMarkupTotal: number;
  lastPayment?: { at?: string; amountIls?: number | null } | null;
  nextPartnerSubscriptionRenewal?: string | null;
  snapshotError?: string;
};
