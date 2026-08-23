export type TriAnswer = "" | "no" | "yes" | "unsure";

export type PostDemoAnswers = {
  relevant: { selections: string[]; other: string; note: string };
  missing: { answer: TriAnswer; detail: string };
  unclear: string;
  automation: { selections: string[]; other: string; detail: string };
  migration: { answer: TriAnswer; detail: string };
  integrations: { answer: TriAnswer; detail: string };
  workflowFit: string;
  services: { selections: string[]; other: string; detail: string };
  blockers: { selections: string[]; other: string };
  startTiming: string;
  startTimingOther: string;
  extraNotes: string;
  /** Legacy — kept for older saved sessions */
  mainGoal?: string;
};

export const EMPTY_ANSWERS: PostDemoAnswers = {
  relevant: { selections: [], other: "", note: "" },
  missing: { answer: "", detail: "" },
  unclear: "",
  automation: { selections: [], other: "", detail: "" },
  migration: { answer: "", detail: "" },
  integrations: { answer: "", detail: "" },
  workflowFit: "",
  services: { selections: [], other: "", detail: "" },
  blockers: { selections: [], other: "" },
  startTiming: "",
  startTimingOther: "",
  extraNotes: "",
};

export const RELEVANT_OPTIONS = [
  { value: "crm", label: "CRM וניהול לקוחות", icon: "👥" },
  { value: "leads", label: "ניהול לידים", icon: "🎯" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "automations", label: "אוטומציות", icon: "⚡" },
  { value: "website", label: "אתר", icon: "🌐" },
  { value: "scheduling", label: "תיאום פגישות", icon: "📅" },
  { value: "tasks", label: "ניהול משימות", icon: "✅" },
  { value: "collab", label: "שיתופי פעולה", icon: "🤝" },
  { value: "full_system", label: "מערכת מלאה", icon: "✨" },
  { value: "other", label: "אחר", icon: "➕" },
] as const;

export const AUTOMATION_OPTIONS = [
  { value: "new_lead_msg", label: "הודעה אוטומטית לליד חדש", icon: "📩" },
  { value: "lead_followup", label: "Follow-up ללידים", icon: "🔁" },
  { value: "client_reminders", label: "תזכורות ללקוחות", icon: "🔔" },
  { value: "internal_reminders", label: "תזכורות פנימיות", icon: "⏰" },
  { value: "status_changes", label: "שינוי סטטוסים", icon: "🏷️" },
  { value: "task_creation", label: "יצירת משימות", icon: "📝" },
  { value: "alerts", label: "התראות", icon: "📣" },
  { value: "scheduling", label: "תיאום פגישות", icon: "📆" },
  { value: "whatsapp_msgs", label: "הודעות WhatsApp", icon: "💬" },
  { value: "internal_flows", label: "תהליכים פנימיים בעסק", icon: "⚙️" },
  { value: "other", label: "אחר", icon: "➕" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "website_build", label: "בניית אתר", icon: "🌐" },
  { value: "automation_build", label: "בניית אוטומציות", icon: "⚡" },
  { value: "sales_agents", label: "נציגי מכירות שחוזרים ללידים", icon: "📞" },
  { value: "other", label: "אחר", icon: "➕" },
  { value: "not_now", label: "לא כרגע", icon: "—" },
] as const;

export const BLOCKER_OPTIONS = [
  { value: "price", label: "המחיר", icon: "💰" },
  { value: "missing_feature", label: "חסר לי משהו במערכת", icon: "🧩" },
  { value: "migration", label: "מעבר ממערכת קיימת", icon: "🔄" },
  { value: "onboarding_time", label: "זמן להטמעה", icon: "⏳" },
  { value: "need_consult", label: "צריך להתייעץ עם אדם נוסף", icon: "👥" },
  { value: "not_sure_fit", label: "עדיין לא בטוח/ה שזה מתאים לעסק", icon: "🤔" },
  { value: "need_more_info", label: "צריך להבין יותר איך זה יעבוד אצלנו", icon: "📋" },
  { value: "nothing_blocking", label: "אין כרגע משהו שמונע ממני להתקדם", icon: "✅" },
  { value: "other", label: "אחר", icon: "➕" },
] as const;

export const START_TIMING_OPTIONS = [
  { value: "asap", label: "בהקדם האפשרי" },
  { value: "soon", label: "בימים הקרובים" },
  { value: "this_month", label: "במהלך החודש" },
  { value: "next_month", label: "בחודש הבא" },
  { value: "later", label: "בהמשך" },
  { value: "unknown", label: "עדיין לא יודע/ת" },
  { value: "other", label: "אחר" },
] as const;

export const TRI_OPTIONS = [
  { value: "no", label: "לא" },
  { value: "yes", label: "כן" },
  { value: "unsure", label: "לא בטוח/ה" },
] as const;

export const STEP_ORDER = [
  "intro",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "summary",
  "success",
] as const;
export type StepKey = (typeof STEP_ORDER)[number];

export const QUESTION_STEPS = STEP_ORDER.filter(
  (s) => !["intro", "summary", "success"].includes(s)
) as readonly Exclude<StepKey, "intro" | "summary" | "success">[];

export function stepIndex(key: StepKey) {
  const idx = STEP_ORDER.indexOf(key);
  return idx < 0 ? 0 : idx;
}

export function isStepKey(value: unknown): value is StepKey {
  return typeof value === "string" && (STEP_ORDER as readonly string[]).includes(value);
}

export function mergeAnswers(raw: any): PostDemoAnswers {
  const base = JSON.parse(JSON.stringify(EMPTY_ANSWERS)) as PostDemoAnswers;
  if (!raw || typeof raw !== "object") return base;
  return {
    ...base,
    ...raw,
    relevant: { ...base.relevant, ...(raw.relevant || {}) },
    missing: { ...base.missing, ...(raw.missing || {}) },
    automation: {
      ...base.automation,
      ...(raw.automation || {}),
      detail: String(raw.automation?.detail ?? base.automation.detail ?? ""),
    },
    migration: { ...base.migration, ...(raw.migration || {}) },
    integrations: { ...base.integrations, ...(raw.integrations || {}) },
    services: { ...base.services, ...(raw.services || {}) },
    blockers: { ...base.blockers, ...(raw.blockers || {}) },
    unclear: String(raw.unclear ?? base.unclear),
    workflowFit: String(raw.workflowFit ?? base.workflowFit),
    startTimingOther: String(raw.startTimingOther ?? base.startTimingOther),
    mainGoal: raw.mainGoal ? String(raw.mainGoal) : undefined,
  };
}
