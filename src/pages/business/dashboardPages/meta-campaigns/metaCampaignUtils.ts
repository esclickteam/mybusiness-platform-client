export function formatCurrency(
  value: number,
  currency = "ILS",
  locale = "he-IL"
) {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: amount >= 100 ? 0 : 2,
    }).format(amount);
  } catch {
    return `₪ ${amount.toLocaleString(locale)}`;
  }
}

export function formatNumber(value: number, locale = "he-IL") {
  return new Intl.NumberFormat(locale).format(Number(value) || 0);
}

export function formatPercent(value: number, digits = 1) {
  return `${(Number(value) || 0).toFixed(digits)}%`;
}

export function formatRoas(value: number) {
  return `${(Number(value) || 0).toFixed(1)}x`;
}

export function statusTone(status: string) {
  const value = String(status || "").toUpperCase();
  if (value === "ACTIVE") {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      dot: "bg-emerald-500",
    };
  }
  if (value === "PAUSED") {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      dot: "bg-amber-500",
    };
  }
  if (value === "DRAFT" || value === "PENDING_REVIEW" || value === "IN_PROCESS") {
    return {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    };
  }
  return {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };
}

export function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const DATE_RANGE_OPTIONS = [
  { value: 7, labelKey: "metaCampaigns.ranges.last7" },
  { value: 14, labelKey: "metaCampaigns.ranges.last14" },
  { value: 30, labelKey: "metaCampaigns.ranges.last30" },
  { value: 90, labelKey: "metaCampaigns.ranges.last90" },
] as const;

export const SEGMENT_OPTIONS = [
  { value: "all", labelKey: "metaCampaigns.segments.all" },
  { value: "leads", labelKey: "metaCampaigns.segments.leads" },
  { value: "sales", labelKey: "metaCampaigns.segments.sales" },
  { value: "traffic", labelKey: "metaCampaigns.segments.traffic" },
  { value: "awareness", labelKey: "metaCampaigns.segments.awareness" },
  { value: "engagement", labelKey: "metaCampaigns.segments.engagement" },
] as const;

export const OBJECTIVE_OPTIONS = [
  {
    value: "OUTCOME_AWARENESS",
    labelKey: "metaCampaigns.objectives.awareness",
    descriptionKey: "metaCampaigns.objectives.awarenessDesc",
  },
  {
    value: "OUTCOME_TRAFFIC",
    labelKey: "metaCampaigns.objectives.traffic",
    descriptionKey: "metaCampaigns.objectives.trafficDesc",
  },
  {
    value: "OUTCOME_ENGAGEMENT",
    labelKey: "metaCampaigns.objectives.engagement",
    descriptionKey: "metaCampaigns.objectives.engagementDesc",
  },
  {
    value: "OUTCOME_LEADS",
    labelKey: "metaCampaigns.objectives.leads",
    descriptionKey: "metaCampaigns.objectives.leadsDesc",
  },
  {
    value: "OUTCOME_APP_PROMOTION",
    labelKey: "metaCampaigns.objectives.app",
    descriptionKey: "metaCampaigns.objectives.appDesc",
  },
  {
    value: "OUTCOME_SALES",
    labelKey: "metaCampaigns.objectives.sales",
    descriptionKey: "metaCampaigns.objectives.salesDesc",
  },
] as const;

/** Numeric Meta ad account id (without `act_` prefix), matching Ads Manager. */
export function resolveAdAccountId(account?: {
  accountId?: string | null;
  id?: string | null;
} | null) {
  const raw = String(account?.accountId || "").trim();
  if (raw) return raw.replace(/^act_/i, "");
  const graphId = String(account?.id || "").trim();
  if (!graphId) return "";
  return graphId.replace(/^act_/i, "");
}

/** Meta Instant Form contact fields (Ads Manager parity). */
export const LEAD_FORM_CONTACT_FIELDS = [
  { type: "FULL_NAME", labelHe: "שם מלא", labelEn: "Full name", defaultSelected: true },
  { type: "EMAIL", labelHe: "אימייל", labelEn: "Email", defaultSelected: true },
  { type: "PHONE", labelHe: "מספר טלפון", labelEn: "Phone number", defaultSelected: true },
  { type: "FIRST_NAME", labelHe: "שם פרטי", labelEn: "First name", defaultSelected: false },
  { type: "LAST_NAME", labelHe: "שם משפחה", labelEn: "Last name", defaultSelected: false },
  { type: "CITY", labelHe: "עיר", labelEn: "City", defaultSelected: false },
  { type: "STATE", labelHe: "מדינה / אזור", labelEn: "State / Province", defaultSelected: false },
  { type: "COUNTRY", labelHe: "ארץ", labelEn: "Country", defaultSelected: false },
  { type: "POST_CODE", labelHe: "מיקוד", labelEn: "Post code", defaultSelected: false },
  { type: "STREET_ADDRESS", labelHe: "כתובת", labelEn: "Street address", defaultSelected: false },
  { type: "DOB", labelHe: "תאריך לידה", labelEn: "Date of birth", defaultSelected: false },
  { type: "GENDER", labelHe: "מגדר", labelEn: "Gender", defaultSelected: false },
  { type: "JOB_TITLE", labelHe: "תפקיד", labelEn: "Job title", defaultSelected: false },
  { type: "COMPANY_NAME", labelHe: "שם החברה", labelEn: "Company name", defaultSelected: false },
  { type: "WORK_EMAIL", labelHe: "אימייל עבודה", labelEn: "Work email", defaultSelected: false },
  { type: "WORK_PHONE_NUMBER", labelHe: "טלפון עבודה", labelEn: "Work phone", defaultSelected: false },
  { type: "WHATSAPP_NUMBER", labelHe: "וואטסאפ", labelEn: "WhatsApp number", defaultSelected: false },
  { type: "WEBSITE", labelHe: "אתר", labelEn: "Website", defaultSelected: false },
] as const;

export type LeadFormAnswerType = "short_answer" | "multiple_choice";

export type LeadFormCustomQuestionDraft = {
  id: string;
  label: string;
  answerType: LeadFormAnswerType;
  options: string[];
};

export function createLeadFormCustomQuestion(
  partial?: Partial<LeadFormCustomQuestionDraft>
): LeadFormCustomQuestionDraft {
  return {
    id:
      partial?.id ||
      `custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    label: partial?.label || "",
    answerType: partial?.answerType || "multiple_choice",
    options: partial?.options?.length ? [...partial.options] : ["", ""],
  };
}

export function defaultSelectedLeadContactTypes() {
  return LEAD_FORM_CONTACT_FIELDS.filter((field) => field.defaultSelected).map(
    (field) => field.type
  );
}

export function buildMetaLeadFormQuestionsPayload(input: {
  contactTypes: string[];
  customQuestions: LeadFormCustomQuestionDraft[];
}) {
  const contactQuestions = (input.contactTypes || [])
    .map((type) => String(type || "").trim().toUpperCase())
    .filter(Boolean)
    .map((type) => ({ type }));

  const customQuestions = (input.customQuestions || [])
    .map((question, index) => {
      const label = String(question.label || "").trim();
      if (!label) return null;
      const payload: {
        type: "CUSTOM";
        key: string;
        label: string;
        answerType: LeadFormAnswerType;
        options?: string[];
      } = {
        type: "CUSTOM",
        key: `question_${index + 1}`,
        label,
        answerType: question.answerType || "short_answer",
      };
      if (question.answerType === "multiple_choice") {
        payload.options = (question.options || [])
          .map((opt) => String(opt || "").trim())
          .filter(Boolean);
      }
      return payload;
    })
    .filter(Boolean) as Array<{
    type: "CUSTOM";
    key: string;
    label: string;
    answerType: LeadFormAnswerType;
    options?: string[];
  }>;

  return [...contactQuestions, ...customQuestions];
}

export function validateLeadFormBuilder(input: {
  contactTypes: string[];
  customQuestions: LeadFormCustomQuestionDraft[];
}): string | null {
  for (const question of input.customQuestions || []) {
    const label = String(question.label || "").trim();
    const filledOptions = (question.options || [])
      .map((opt) => String(opt || "").trim())
      .filter(Boolean);

    // Ignore blank drafts the user hasn't filled yet.
    if (!label && !filledOptions.length) continue;
    if (!label) return "customQuestionLabelRequired";
    if (question.answerType === "multiple_choice" && filledOptions.length < 2) {
      return "multipleChoiceOptionsRequired";
    }
  }

  const questions = buildMetaLeadFormQuestionsPayload(input);
  if (!questions.length) return "atLeastOneQuestion";
  return null;
}

/** Meta-style label: `Name (USD) · 1234567890` */
export function formatAdAccountLabel(
  account?: {
    name?: string | null;
    currency?: string | null;
    accountId?: string | null;
    id?: string | null;
  } | null,
  options?: { fallbackName?: string; includeCurrency?: boolean }
) {
  const name =
    String(account?.name || "").trim() ||
    options?.fallbackName ||
    "Ad Account";
  const currency = String(account?.currency || "").trim();
  const accountId = resolveAdAccountId(account);
  const includeCurrency = options?.includeCurrency !== false;

  const parts = [name];
  if (includeCurrency && currency) {
    parts[0] = `${name} (${currency})`;
  }
  if (accountId) {
    parts.push(accountId);
  }
  return parts.join(" · ");
}
