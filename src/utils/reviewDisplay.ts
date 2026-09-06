import i18n from "../i18n/i18n";
import { getIntlLocale } from "../i18n/localeUtils";

export type RatingKey =
  | "service"
  | "professionalism"
  | "professional"
  | "timeliness"
  | "timing"
  | "availability"
  | "valueForMoney"
  | "value"
  | "goalAchievement"
  | "goal"
  | "overall"
  | "experience";

export type RatingValue = number | string | null | undefined;

export type ReviewClient =
  | string
  | {
      name?: string;
      fullName?: string;
      [key: string]: unknown;
    };

export type ReviewRecord = {
  _id?: string;
  id?: string;
  client?: ReviewClient;
  clientName?: string;
  user?: string;
  userName?: string;
  name?: string;
  comment?: string;
  text?: string;
  createdAt?: string | Date;
  date?: string | Date;
  averageScore?: number | string;
  rating?: number | string;
  ratings?: Partial<Record<RatingKey, RatingValue>>;
  [key: string]: unknown;
};

type RatingMeta = {
  label: string;
  icon: string;
};

const RATING_FIELD_ORDER: RatingKey[] = [
  "overall",
  "experience",
  "service",
  "professionalism",
  "professional",
  "timeliness",
  "timing",
  "availability",
  "valueForMoney",
  "value",
  "goalAchievement",
  "goal",
];

const ratingLabelKeys: Record<string, { labelKey: string; fallback: string; icon: string }> = {
  service: { labelKey: "leftover.reviews.service", fallback: "Service", icon: "service" },
  professional: { labelKey: "leftover.reviews.professional", fallback: "Professionalism", icon: "professionalism" },
  professionalism: { labelKey: "leftover.reviews.professional", fallback: "Professionalism", icon: "professionalism" },
  timing: { labelKey: "leftover.reviews.timing", fallback: "Punctuality", icon: "timeliness" },
  timeliness: { labelKey: "leftover.reviews.timing", fallback: "Punctuality", icon: "timeliness" },
  availability: { labelKey: "leftover.reviews.availability", fallback: "Availability", icon: "availability" },
  value: { labelKey: "leftover.reviews.value", fallback: "Value for money", icon: "valueForMoney" },
  valueForMoney: { labelKey: "leftover.reviews.value", fallback: "Value for money", icon: "valueForMoney" },
  goal: { labelKey: "leftover.reviews.goal", fallback: "Goal achieved", icon: "goalAchievement" },
  goalAchievement: { labelKey: "leftover.reviews.goal", fallback: "Goal achieved", icon: "goalAchievement" },
  experience: { labelKey: "leftover.reviews.experience", fallback: "Overall experience", icon: "overall" },
  overall: { labelKey: "leftover.reviews.experience", fallback: "Overall experience", icon: "overall" },
};

function ratingMeta(key: string): RatingMeta {
  const def = ratingLabelKeys[key];
  if (!def) return { label: key, icon: "rating" };
  return { label: i18n.t(def.labelKey, def.fallback), icon: def.icon };
}

const RATING_ALIASES: Record<string, RatingKey> = {
  overall: "overall",
  experience: "overall",
  service: "service",
  professionalism: "professionalism",
  professional: "professionalism",
  timeliness: "timeliness",
  timing: "timeliness",
  availability: "availability",
  valueForMoney: "valueForMoney",
  value: "valueForMoney",
  goalAchievement: "goalAchievement",
  goal: "goalAchievement",
};

export function toRatedNumber(value: RatingValue) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 1) return null;

  return Math.max(1, Math.min(5, numberValue));
}

export function getReviewClientName(review: ReviewRecord) {
  if (typeof review.client === "string" && review.client.trim()) {
    return review.client;
  }

  if (review.client && typeof review.client === "object") {
    return (
      review.client.name ||
      review.client.fullName ||
      i18n.t("leftover.reviews.anonymous", "Anonymous customer")
    );
  }

  return (
    review.clientName ||
    review.userName ||
    review.user ||
    review.name ||
    i18n.t("leftover.reviews.anonymous", "Anonymous customer")
  );
}

export function getReviewText(review: ReviewRecord) {
  return review.comment || review.text || "";
}

export function getReviewDateLabel(date?: string | Date) {
  if (!date) return i18n.t("leftover.reviews.noDate", "Date not specified");

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString(getIntlLocale(i18n.language), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getReviewRatingEntries(review: ReviewRecord) {
  const ratings = review.ratings || {};
  const merged = new Map<
    string,
    { key: string; value: number; meta: RatingMeta }
  >();

  for (const [rawKey, rawValue] of Object.entries(ratings)) {
    const numericValue = toRatedNumber(rawValue);
    if (numericValue === null) continue;

    const canonicalKey = RATING_ALIASES[rawKey] || rawKey;
    const meta = ratingLabelKeys[canonicalKey] || ratingLabelKeys[rawKey]
      ? ratingMeta(canonicalKey in ratingLabelKeys ? canonicalKey : rawKey)
      : {
          label: rawKey,
          icon: "rating",
        };

    merged.set(canonicalKey, {
      key: canonicalKey,
      value: numericValue,
      meta,
    });
  }

  return RATING_FIELD_ORDER.filter((key) => merged.has(key)).map(
    (key) => merged.get(key)!
  );
}

export function getReviewAverage(
  review: ReviewRecord,
  ratingEntries: { value: number }[]
) {
  const averageScore = toRatedNumber(review.averageScore);
  if (averageScore !== null) return averageScore;

  const directRating = toRatedNumber(review.rating);
  if (directRating !== null) return directRating;

  if (ratingEntries.length > 0) {
    const total = ratingEntries.reduce((sum, item) => sum + item.value, 0);
    return Number((total / ratingEntries.length).toFixed(1));
  }

  return 0;
}

export function getReviewRatingLabel(average: number) {
  if (!average) return i18n.t("leftover.reviews.noneYet", "Not rated yet");
  if (average >= 4.7) return i18n.t("leftover.reviews.outstanding", "Outstanding");
  if (average >= 4.3) return i18n.t("leftover.reviews.excellent", "Excellent");
  if (average >= 4) return i18n.t("leftover.reviews.veryGood", "Very good");
  if (average >= 3) return i18n.t("leftover.reviews.good", "Good");
  return i18n.t("leftover.reviews.needsWork", "Needs improvement");
}

export const REVIEW_RATING_PARAMETER_DEFINITIONS = [
  { labelKey: "leftover.reviews.experience", fallback: "Overall experience", required: true },
  { labelKey: "leftover.reviews.serviceQuality", fallback: "Service quality", required: true },
  { labelKey: "leftover.reviews.professional", fallback: "Professionalism", required: true },
  { labelKey: "leftover.reviews.timing", fallback: "Punctuality", required: false },
  { labelKey: "leftover.reviews.availability", fallback: "Availability", required: false },
  { labelKey: "leftover.reviews.value", fallback: "Value for money", required: false },
  { labelKey: "leftover.reviews.goal", fallback: "Goal achieved", required: false },
] as const;
