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

const ratingLabels: Record<string, RatingMeta> = {
  service: { label: "שירות", icon: "service" },
  professional: { label: "מקצועיות", icon: "professionalism" },
  professionalism: { label: "מקצועיות", icon: "professionalism" },
  timing: { label: "עמידה בזמנים", icon: "timeliness" },
  timeliness: { label: "עמידה בזמנים", icon: "timeliness" },
  availability: { label: "זמינות", icon: "availability" },
  value: { label: "תמורה למחיר", icon: "valueForMoney" },
  valueForMoney: { label: "תמורה למחיר", icon: "valueForMoney" },
  goal: { label: "השגת מטרה", icon: "goalAchievement" },
  goalAchievement: { label: "השגת מטרה", icon: "goalAchievement" },
  experience: { label: "חוויה כללית", icon: "overall" },
  overall: { label: "חוויה כללית", icon: "overall" },
};

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
    return review.client.name || review.client.fullName || "לקוח אנונימי";
  }

  return (
    review.clientName ||
    review.userName ||
    review.user ||
    review.name ||
    "לקוח אנונימי"
  );
}

export function getReviewText(review: ReviewRecord) {
  return review.comment || review.text || "";
}

export function getReviewDateLabel(date?: string | Date) {
  if (!date) return "לא צוין תאריך";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("he-IL", {
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
    const meta = ratingLabels[canonicalKey] || ratingLabels[rawKey] || {
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
  if (!average) return "ללא דירוג";
  if (average >= 4.7) return "מצוין";
  if (average >= 4.3) return "מעולה";
  if (average >= 4) return "טוב מאוד";
  if (average >= 3) return "טוב";
  return "דורש שיפור";
}
