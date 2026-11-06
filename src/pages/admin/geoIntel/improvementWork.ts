export const WORK_LABELS = {
  brand: "מותג",
  engine: "מנוע",
  question: "שאלה",
  outcome: "תוצאת המדידה",
  source: "מקור תומך",
  competitors: "מתחרים שהופיעו",
  gap: "סיבת הפער",
  target: "עמוד יעד מוצע",
  action: "המלצת פעולה",
  priority: "עדיפות",
  impact: "השפעה צפויה",
  confidence: "רמת ביטחון",
  status: "סטטוס ביצוע",
  tracking: "מעקב",
  noGap: "אין ראיה שמספיקה לקבוע סיבה לפער.",
  noCompetitors: "לא זוהו מתחרים במדידה.",
  noQuestion: "אין שאלה אחת. המשימה מצרפת כמה מדידות.",
  noSource: "לא נשמר מקור תומך במדידה זו.",
  hypothesis: "השערה שממתינה לאימות, לא עובדה.",
  fact: "עובדה שנמדדה",
  hypothesisTitle: "השערה",
  recommendation: "המלצה",
  noHypothesis: "אין השערה נוספת מעבר לעובדה שנמדדה.",
  save: "שמור מעקב",
  taskSource: "מקור המשימה",
  notMeasured: "לא נמדד",
} as const;

const FINDING_KIND_HE: Record<string, string> = {
  measurement_summary: "סיכום מדידות",
  competitor_visible_brand_missing: "מתחרים הופיעו והמותג לא",
  external_source_frequency: "מקור חיצוני חוזר",
  site_topic_coverage_gap: "חשד לכיסוי נושא",
};

const STATUS_HE: Record<string, string> = {
  todo: "לביצוע",
  in_progress: "בתהליך",
  done: "הושלם",
  dismissed: "נדחה",
};

export function findingKindHe(kind: string) {
  return FINDING_KIND_HE[kind] || "ממצא";
}

export function taskStatusHe(status: string) {
  return STATUS_HE[status] || "לביצוע";
}

export function workHasPublicJargon(text: string) {
  return /SEO|AEO|\bGEO\b/.test(text);
}

export type WorkSource = {
  url?: string;
  title?: string;
  domain?: string;
};

export type WorkCard = {
  brandName: string;
  engine: string;
  question: string;
  outcomeHe: string;
  checkedAt: string | null;
  sources: WorkSource[];
  competitors: string[];
  gapReasonHe: string | null;
  targetPath: string | null;
  targetNoteHe: string;
  actionHe: string;
  impactHe: string;
  confidenceHe: string;
  priorityScore: number;
  priorityNoteHe: string;
  provenanceHe: string;
  factHe: string;
  hypothesisHe: string | null;
  recommendationHe: string;
  targetState: string;
  targetVerified: boolean;
  sourceLabelHe: string;
};

export function measuredMetricText(
  metric?: { measured?: boolean; value?: number | null } | null,
  format?: (value: number) => string
) {
  if (!metric?.measured || metric.value == null) return WORK_LABELS.notMeasured;
  return format ? format(metric.value) : String(metric.value);
}

export function workCardFromTask(task: any, brandName = ""): WorkCard {
  const work = task?.work || {};
  return {
    brandName: work.brandName || brandName || "",
    engine: work.engine || task?.engine || "",
    question: work.question || task?.promptText || "",
    outcomeHe: work.outcomeHe || task?.outcomeHe || "",
    checkedAt: work.checkedAt || task?.checkedAt || null,
    sources: work.sources || task?.evidenceSources || [],
    competitors: work.competitors || task?.competitors || [],
    gapReasonHe: work.gapReasonHe ?? task?.gapReasonHe ?? null,
    targetPath: work.targetPath ?? task?.suggestedPath ?? null,
    targetNoteHe: work.targetNoteHe || task?.targetNoteHe || WORK_LABELS.noGap,
    actionHe: work.actionHe || task?.actionHe || "",
    impactHe: work.impactHe || "",
    confidenceHe: work.confidenceHe || "",
    priorityScore: Number(work.priorityScore ?? task?.priorityScore ?? 0),
    priorityNoteHe: work.priorityNoteHe || "",
    provenanceHe:
      work.provenanceHe ||
      (task?.provenance === "proven" ? "נגזר ממדידה" : WORK_LABELS.hypothesis),
    factHe: work.factHe || work.outcomeHe || task?.outcomeHe || "",
    hypothesisHe: work.hypothesisHe ?? null,
    recommendationHe: work.recommendationHe || work.actionHe || task?.actionHe || "",
    targetState: work.targetState || (work.targetPath || task?.suggestedPath ? "unchecked" : "none"),
    targetVerified: work.targetVerified === true,
    sourceLabelHe: work.sourceLabelHe || "מדידת שאלות",
  };
}

export function targetPageLabel(card: Pick<WorkCard, "targetPath" | "targetNoteHe" | "targetState" | "targetVerified">) {
  if (card.targetVerified === true && card.targetState === "exists" && card.targetPath) {
    return card.targetNoteHe || `העמוד ${card.targetPath} נמצא באתר הציבורי. לא בוצע בו שינוי.`;
  }
  if (card.targetState === "missing") {
    return card.targetNoteHe || "העמוד המוצע לא נמצא באתר הציבורי, ולכן הוא לא מוצג כעמוד מאומת.";
  }
  if (card.targetPath) {
    return card.targetNoteHe || `כיוון ${card.targetPath} לא אומת מול האתר.`;
  }
  return card.targetNoteHe || "לא זוהה עמוד יעד מתוך המדידה.";
}
