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

/** Show em dash when a metric is missing — avoid fake-looking zeros. */
export function formatMetricOrDash(
  value: number | null | undefined,
  formatter: (n: number) => string,
  options?: { treatZeroAsEmpty?: boolean }
) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  if (options?.treatZeroAsEmpty && n === 0) return "—";
  return formatter(n);
}

export function toLocalIsoDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateTimeHe(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateHe(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("he-IL");
}

/** Meta Marketing API account_status codes. */
export function resolveMetaAccountStatus(status?: number | null) {
  const code = Number(status);
  if (code === 1) return { key: "active", labelEn: "Active" };
  if (code === 2) return { key: "disabled", labelEn: "Disabled" };
  if (code === 3) return { key: "unsettled", labelEn: "Unsettled" };
  if (code === 7) return { key: "pendingRisk", labelEn: "Pending risk review" };
  if (code === 8) return { key: "pendingSettlement", labelEn: "Pending settlement" };
  if (code === 9) return { key: "inGrace", labelEn: "In grace period" };
  if (code === 100) return { key: "pendingClosure", labelEn: "Pending closure" };
  if (code === 101) return { key: "closed", labelEn: "Closed" };
  if (!Number.isFinite(code) || code <= 0) {
    return { key: "unknown", labelEn: "—" };
  }
  return { key: "other", labelEn: String(code) };
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
  if (value === "IN_PROCESS") {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      dot: "bg-emerald-300",
    };
  }
  if (value === "DRAFT" || value === "PENDING_REVIEW") {
    return {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    };
  }
  if (value === "DISAPPROVED" || value === "REJECTED" || value === "WITH_ISSUES") {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-100",
      dot: "bg-rose-500",
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
  return toLocalIsoDate(d);
}

export function todayIso() {
  return toLocalIsoDate();
}

export type MetaDateRangePreset =
  | "last_7"
  | "last_14"
  | "last_30"
  | "this_month"
  | "last_month"
  | "custom";

export const DATE_RANGE_OPTIONS = [
  { value: "last_7" as const, labelKey: "metaCampaigns.ranges.last7" },
  { value: "last_14" as const, labelKey: "metaCampaigns.ranges.last14" },
  { value: "last_30" as const, labelKey: "metaCampaigns.ranges.last30" },
  { value: "this_month" as const, labelKey: "metaCampaigns.ranges.thisMonth" },
  { value: "last_month" as const, labelKey: "metaCampaigns.ranges.lastMonth" },
  { value: "custom" as const, labelKey: "metaCampaigns.ranges.custom" },
];

/** Build overview query params for real Meta insights fetches. */
export function resolveMetaDateRangeQuery(
  preset: MetaDateRangePreset,
  custom?: { since?: string; until?: string }
): { days?: number; since?: string; until?: string } {
  const until = todayIso();
  if (preset === "last_7") return { days: 7 };
  if (preset === "last_14") return { days: 14 };
  if (preset === "last_30") return { days: 30 };

  if (preset === "this_month") {
    const now = new Date();
    const since = toLocalIsoDate(new Date(now.getFullYear(), now.getMonth(), 1));
    return { since, until };
  }

  if (preset === "last_month") {
    const now = new Date();
    const firstThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastPrev = new Date(firstThisMonth.getTime() - 24 * 60 * 60 * 1000);
    const firstPrev = new Date(lastPrev.getFullYear(), lastPrev.getMonth(), 1);
    return {
      since: toLocalIsoDate(firstPrev),
      until: toLocalIsoDate(lastPrev),
    };
  }

  const since = String(custom?.since || "").trim() || daysAgoIso(29);
  const customUntil = String(custom?.until || "").trim() || until;
  return { since, until: customUntil };
}

export const SEGMENT_OPTIONS = [
  { value: "all", labelKey: "metaCampaigns.segments.all" },
  { value: "leads", labelKey: "metaCampaigns.segments.leads" },
  { value: "sales", labelKey: "metaCampaigns.segments.sales" },
  { value: "traffic", labelKey: "metaCampaigns.segments.traffic" },
  { value: "awareness", labelKey: "metaCampaigns.segments.awareness" },
  { value: "engagement", labelKey: "metaCampaigns.segments.engagement" },
] as const;

/** Meta generatepreviews ad_format values used in the create wizard. */
export const META_PREVIEW_FORMATS = [
  "MOBILE_FEED_STANDARD",
  "DESKTOP_FEED_STANDARD",
  "FACEBOOK_STORY_MOBILE",
  "FACEBOOK_REELS_MOBILE",
  "INSTAGRAM_STANDARD",
  "INSTAGRAM_STORY",
  "INSTAGRAM_REELS",
] as const;

export type MetaPreviewFormat = (typeof META_PREVIEW_FORMATS)[number];

/** Map selected placements (step 4) → Meta official preview formats. */
export function resolvePreviewFormatsForPlacements(input: {
  placementMode: "advantage" | "facebook" | "instagram" | "both" | string;
  facebookFeed?: boolean;
  facebookStory?: boolean;
  facebookReels?: boolean;
  instagramFeed?: boolean;
  instagramStory?: boolean;
  instagramReels?: boolean;
}): MetaPreviewFormat[] {
  const mode = String(input.placementMode || "both").toLowerCase();
  const formats: MetaPreviewFormat[] = [];

  const useFacebook =
    mode === "advantage" || mode === "both" || mode === "facebook";
  const useInstagram =
    mode === "advantage" || mode === "both" || mode === "instagram";

  const fbFeed = mode === "advantage" ? true : Boolean(input.facebookFeed);
  const fbStory = mode === "advantage" ? true : Boolean(input.facebookStory);
  const fbReels = mode === "advantage" ? true : Boolean(input.facebookReels);
  const igFeed = mode === "advantage" ? true : Boolean(input.instagramFeed);
  const igStory = mode === "advantage" ? true : Boolean(input.instagramStory);
  const igReels = mode === "advantage" ? true : Boolean(input.instagramReels);

  if (useFacebook && fbFeed) {
    formats.push("MOBILE_FEED_STANDARD", "DESKTOP_FEED_STANDARD");
  }
  if (useFacebook && fbStory) formats.push("FACEBOOK_STORY_MOBILE");
  if (useFacebook && fbReels) formats.push("FACEBOOK_REELS_MOBILE");
  if (useInstagram && igFeed) formats.push("INSTAGRAM_STANDARD");
  if (useInstagram && igStory) formats.push("INSTAGRAM_STORY");
  if (useInstagram && igReels) formats.push("INSTAGRAM_REELS");

  return formats.length ? formats : ["MOBILE_FEED_STANDARD", "INSTAGRAM_STANDARD"];
}

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
  /** Export / CRM field key (Meta Instant Form `key`) */
  key?: string;
  /** Per-option export keys for multiple choice */
  optionKeys?: string[];
};

/** Meta-style export key: spaces → underscores, keep Hebrew letters. */
export function suggestLeadFieldKey(label: string, fallback: string) {
  const base = String(label || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_?\-]+/gu, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 100);
  return base || fallback;
}

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
    key: partial?.key,
    optionKeys: partial?.optionKeys ? [...partial.optionKeys] : undefined,
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
  contactFieldKeys?: Record<string, string>;
}) {
  const contactQuestions = (input.contactTypes || [])
    .map((type) => String(type || "").trim().toUpperCase())
    .filter(Boolean)
    .map((type) => {
      const key = String(input.contactFieldKeys?.[type] || "").trim();
      return key ? { type, key } : { type };
    });

  const customQuestions = (input.customQuestions || [])
    .map((question, index) => {
      const label = String(question.label || "").trim();
      if (!label) return null;
      const fallbackKey = `question_${index + 1}`;
      const payload: {
        type: "CUSTOM";
        key: string;
        label: string;
        answerType: LeadFormAnswerType;
        options?: Array<string | { key: string; value: string }>;
      } = {
        type: "CUSTOM",
        key: suggestLeadFieldKey(question.key || label, fallbackKey),
        label,
        answerType: question.answerType || "short_answer",
      };
      if (question.answerType === "multiple_choice") {
        const opts: Array<{ key: string; value: string }> = [];
        (question.options || []).forEach((opt, optIndex) => {
          const value = String(opt || "").trim();
          if (!value) return;
          const optFallback = `option_${optIndex + 1}`;
          const optKeyRaw = String(question.optionKeys?.[optIndex] || "").trim();
          opts.push({
            key: suggestLeadFieldKey(optKeyRaw || value, optFallback),
            value,
          });
        });
        payload.options = opts;
      }
      return payload;
    })
    .filter(Boolean) as Array<{
    type: "CUSTOM";
    key: string;
    label: string;
    answerType: LeadFormAnswerType;
    options?: Array<string | { key: string; value: string }>;
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
