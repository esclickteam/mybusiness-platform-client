import API from "../api";

export type AgreementStatus =
  | "draft"
  | "ready_for_review"
  | "sent"
  | "partially_signed"
  | "partner_signed"
  | "bizuply_signed"
  | "fully_signed"
  | "signed"
  | "payment_pending"
  | "active"
  | "expired"
  | "terminated"
  | "cancelled";

export type TerritoryType = "" | "exclusive" | "non_exclusive";

export type TerritoryAvailability =
  | "available"
  | "agreement_pending"
  | "exclusive_active"
  | "renewal_window"
  | "expiring_soon";

export type CommissionTier = {
  minCustomers: number;
  maxCustomers: number | null;
  percent: number;
};

export type AgreementSignatory = {
  signatoryId?: string;
  party: "partner" | "bizuply";
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  order: number;
  required: boolean;
  signedAt?: string | null;
  status?: "pending" | "signed";
  linkState?: "none" | "active" | "revoked" | "consumed" | "expired";
};

export type SignatureProgress = {
  partner: { completed: number; required: number; total: number };
  bizuply: { completed: number; required: number; total: number };
};

export type PartnerAgreement = {
  id: string;
  agreementNumber: string;
  status: AgreementStatus;
  partnerId: string;
  brandName: string;
  legalCompanyName: string;
  registrationNumber: string;
  registeredAddress: string;
  incorporationCountryCode: string;
  incorporationCountryName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryEmail: string;
  entityType?: string;
  taxNumber?: string;
  locale?: string;
  bilingual?: boolean;
  secondaryLocale?: string;
  countryCode: string;
  countryName: string;
  subdivisionCode?: string;
  localityName?: string;
  localityKind?: string;
  effectiveDate?: string;
  curePeriod?: string;
  adminNotes?: string;
  territoryName: string;
  territoryType: TerritoryType;
  agreementDate: string;
  startDate: string;
  endDate: string;
  licenseTerm: string;
  licenseFee: number | null;
  currency: string;
  paymentDueDate: string;
  paymentStatus: "unpaid" | "paid";
  paymentReference: string;
  commissionOverride: boolean;
  commissionStructure?: "tiers" | "flat" | "product";
  flatCommissionPercent?: number | null;
  productCommissions?: { name: string; percent: number }[];
  fieldModes?: Record<string, "default" | "custom">;
  paymentSchedule?: string;
  depositAmount?: number | null;
  remainingBalance?: number | null;
  installmentCount?: number | null;
  installments?: { label?: string; amount?: number | null; dueDate?: string }[];
  additionalAmounts?: { label?: string; amount?: number | null }[];
  minimumCustomerTarget?: string;
  renewalPrice?: number | null;
  renewalTerm?: string;
  commercialAudit?: {
    field: string;
    previousValue: string;
    newValue: string;
    adminName: string;
    at: string;
  }[];
  editable?: boolean;
  amendedFromAgreementId?: string;
  commissionPercents: number[];
  tiers: CommissionTier[];
  usesDefaultTiers: boolean;
  salesTarget: string;
  targetPeriod: string;
  renewalDate: string;
  renewalNotes: string;
  specialTermsEnabled: boolean;
  specialTerms: string;
  currentVersion: number;
  signedVersionNumber: number | null;
  templateRevision: string;
  locking: boolean;
  history: { at: string; action: string; fromStatus: string; toStatus: string; note: string }[];
  versions: { versionNumber: number; frozen: boolean; source: string; templateRevision: string; createdAt: string }[];
  renewedFromAgreementId: string;
  renewedToAgreementId: string;
  signingMode?: "parallel" | "sequential";
  signatories?: AgreementSignatory[];
  signatureProgress?: SignatureProgress;
  signatureStatus?: string;
  signatureStatusLabel?: string;
  bizuplyLegalCompanyName?: string;
};

export type AgreementInput = {
  partnerId?: string;
  agreementNumber?: string;
  brandName?: string;
  legalCompanyName?: string;
  registrationNumber?: string;
  registeredAddress?: string;
  incorporationCountryCode?: string;
  contactName?: string;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  signatoryEmail?: string;
  entityType?: string;
  taxNumber?: string;
  agreementDate?: string;
  effectiveDate?: string;
  locale?: string;
  bilingual?: boolean;
  secondaryLocale?: string;
  countryCode?: string;
  subdivisionCode?: string;
  localityName?: string;
  localityKind?: string;
  territoryName?: string;
  territoryType?: TerritoryType;
  startDate?: string;
  endDate?: string;
  licenseTerm?: string;
  licenseFee?: number | string | null;
  currency?: string;
  paymentDueDate?: string;
  commissionOverride?: boolean;
  commissionStructure?: "tiers" | "flat" | "product";
  commissionTiers?: CommissionTier[];
  flatCommissionPercent?: number | string | null;
  productCommissions?: { name: string; percent: number | string }[];
  fieldModes?: Record<string, "default" | "custom">;
  paymentSchedule?: string;
  depositAmount?: number | string | null;
  remainingBalance?: number | string | null;
  installmentCount?: number | string | null;
  installments?: { label?: string; amount?: number | string | null; dueDate?: string }[];
  additionalAmounts?: { label?: string; amount?: number | string | null }[];
  minimumCustomerTarget?: string;
  renewalPrice?: number | string | null;
  renewalTerm?: string;
  commissionPercents?: number[];
  salesTarget?: string;
  targetPeriod?: string;
  curePeriod?: string;
  adminNotes?: string;
  renewalDate?: string;
  renewalNotes?: string;
  specialTermsEnabled?: boolean;
  specialTerms?: string;
  signingMode?: "parallel" | "sequential";
  signatories?: AgreementSignatory[];
};

export type CountryOption = {
  countryCode: string;
  countryName: string;
  availability: TerritoryAvailability;
  selectableForExclusive: boolean;
  partnerName: string;
  agreementId: string;
  agreementNumber: string;
  agreementStatus: string;
  startDate: string;
  endDate: string;
};

export function agreementError(err: unknown, fallback: string) {
  const row = err as {
    message?: string;
    fields?: { field?: string; message?: string }[];
    response?: { data?: { error?: string; code?: string; fields?: { field?: string; message?: string }[] } };
  };
  const data = row?.response?.data;
  const fields = data?.fields || row?.fields;
  const listed = Array.isArray(fields)
    ? fields.map((field) => field?.message || field?.field).filter(Boolean).join(" ")
    : "";
  if (data?.code === "TERRITORY_ALREADY_EXCLUSIVE") {
    return [data.error, listed].filter(Boolean).join(" ") || "This country already has an active exclusive partner agreement.";
  }
  const message = data?.error || (row?.message && row.message !== "Network error" ? row.message : "");
  return [message, listed && !String(message).includes(listed) ? listed : ""].filter(Boolean).join(" ") || fallback;
}

export async function fetchAgreementMeta() {
  const { data } = await API.get("/admin/partner-agreements/meta");
  return data as {
    statuses: AgreementStatus[];
    defaultTiers: CommissionTier[];
    standardCommercial?: {
      licenseFee: number | null;
      currency: string;
      paymentSchedule: string;
      depositAmount: number;
      installmentCount: number;
      curePeriod: string;
      licenseTerm: string;
      renewalTerm: string;
      territoryType: string;
      commissionTiers: CommissionTier[];
    };
    currencies: string[];
    templateRevision: string;
    exclusivityNotice: string;
    expiringSoonDays: number;
  };
}

export async function fetchTerritoryAvailability(q?: string) {
  const { data } = await API.get("/admin/partner-agreements/territories", {
    params: q ? { q } : undefined,
  });
  return data as {
    countries: CountryOption[];
    counts: Record<TerritoryAvailability, number>;
    expiringSoonDays: number;
  };
}

export async function searchAgreementPartners(q: string) {
  const { data } = await API.get("/admin/partner-agreements/partners", { params: { q } });
  return data as {
    items: { id: string; name: string; legalCompanyName: string; country: string; contactEmail: string }[];
  };
}

export async function prefillAgreementPartner(partnerId: string) {
  const { data } = await API.get(`/admin/partner-agreements/partners/${partnerId}/prefill`);
  return data as {
    prefill: {
      partnerId: string;
      brandName: string;
      legalCompanyName: string;
      contactName: string;
      contactEmail: string;
      phone: string;
      whatsapp: string;
      countryCode: string;
      countryName: string;
      territoryName: string;
      territoryType: TerritoryType;
      incorporationCountryCode: string;
      startDate: string;
      endDate: string;
      currentCustomCommissionPercent: number | null;
      publicName: string;
    };
  };
}

export async function listPartnerAgreements(params?: { status?: string; q?: string }) {
  const { data } = await API.get("/admin/partner-agreements", { params });
  return data as { items: PartnerAgreement[] };
}

export async function getPartnerAgreement(id: string) {
  const { data } = await API.get(`/admin/partner-agreements/${id}`);
  return data as { agreement: PartnerAgreement };
}

export async function savePartnerAgreement(id: string | null, input: AgreementInput) {
  if (!id) {
    const { data } = await API.post("/admin/partner-agreements", input);
    return data as { agreement: PartnerAgreement };
  }
  const { data } = await API.patch(`/admin/partner-agreements/${id}`, input);
  return data as { agreement: PartnerAgreement };
}

export async function previewPartnerAgreement(id: string, version?: number) {
  const { data } = await API.get(`/admin/partner-agreements/${id}/preview`, {
    params: version ? { version } : undefined,
  });
  return data as {
    title: string;
    templateRevision: string;
    agreementNumber: string;
    status: string;
    versionNumber: number | null;
    frozen: boolean;
    live: boolean;
    dir?: "ltr" | "rtl" | string;
    locale?: string;
    parts?: { locale: string; dir: string; title: string; sections: { number: number | null; title: string; paragraphs: string[] }[] }[];
    sections: { number: number | null; title: string; paragraphs: string[] }[];
    variables: Record<string, string | string[] | boolean>;
    signatories?: AgreementSignatory[];
  };
}

export async function previewDraftAgreement(input: AgreementInput) {
  const { data } = await API.post("/admin/partner-agreements/preview-draft", input);
  return data as {
    title: string;
    sections: { number: number | null; title: string; paragraphs: string[] }[];
    variables: Record<string, string | string[] | boolean>;
    signatories?: AgreementSignatory[];
    persisted: boolean;
    issues?: { field: string; code?: string; message?: string }[];
  };
}

export async function resendSignatoryLink(id: string, signatoryId: string) {
  const { data } = await API.post(`/admin/partner-agreements/${id}/signatories/${signatoryId}/link`);
  return data as { path: string; expiresAt: string; fullName?: string; notified: boolean };
}

export async function revokeSignatoryLink(id: string, signatoryId: string) {
  const { data } = await API.post(`/admin/partner-agreements/${id}/signatories/${signatoryId}/revoke`);
  return data as { revoked: boolean; signatoryId: string };
}

export async function downloadAgreementPdf(id: string, version?: number) {
  const { data } = await API.get(`/admin/partner-agreements/${id}/pdf`, {
    params: version ? { version } : undefined,
    responseType: "blob",
  });
  return data as Blob;
}

export async function postAgreementAction(
  id: string,
  action: "ready" | "send" | "sign" | "payment-pending" | "payment" | "activate" | "expire" | "terminate" | "cancel",
  body?: Record<string, unknown>
) {
  const { data } = await API.post(`/admin/partner-agreements/${id}/${action}`, body || {});
  return data as { agreement: PartnerAgreement; notified?: boolean; message?: string };
}

export async function fetchSubdivisions(countryCode: string) {
  const { data } = await API.get(`/admin/partner-agreements/subdivisions/${countryCode}`);
  return data as { kind: string; subdivisions: { code: string; name: string }[] };
}

export async function amendPartnerAgreement(id: string) {
  const { data } = await API.post(`/admin/partner-agreements/${id}/amend`);
  return data as { agreement: PartnerAgreement };
}

export async function renewPartnerAgreement(
  id: string,
  body: { startDate: string; endDate: string; agreementNumber?: string; renewalNotes?: string }
) {
  const { data } = await API.post(`/admin/partner-agreements/${id}/renew`, body);
  return data as { agreement: PartnerAgreement };
}

export async function quoteAgreementCommission(body: {
  commissionOverride: boolean;
  commissionPercents: number[];
  activePayingCustomers: number;
  grossCollected: number;
  taxes: number;
  refunds: number;
  chargebacks: number;
  passThroughUsage: number;
}) {
  const { data } = await API.post("/admin/partner-agreements/commission-quote", body);
  return data as {
    commissionableRevenue: number;
    percent: number;
    amount: number;
    activePayingCustomers: number;
  };
}
