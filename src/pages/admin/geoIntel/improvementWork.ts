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
};

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
  };
}
