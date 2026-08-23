export type TriAnswer = "" | "no" | "yes" | "unsure";
export type FileAnswer = "" | "yes" | "no" | "unknown";

export type PostDemoAnswers = {
  relevant: { selections: string[]; other: string; note: string };
  goals: { selections: string[]; other: string };
  currentTool: { answer: TriAnswer; detail: string };
  transfer: { selections: string[]; other: string; hasFile: FileAnswer };
  automation: { selections: string[]; other: string; detail: string };
  specialProcess: string;
  services: { selections: string[]; other: string };
  blockers: { selections: string[]; other: string };
  startTiming: string;
  startTimingOther: string;
  extraNotes: string;
  /** Legacy fields kept so older saved sessions still display in admin. */
  missing?: { answer: TriAnswer; detail: string };
  unclear?: string;
  integrations?: { answer: TriAnswer; detail: string };
  mainGoal?: string;
};

export const EMPTY_ANSWERS: PostDemoAnswers = {
  relevant: { selections: [], other: "", note: "" },
  goals: { selections: [], other: "" },
  currentTool: { answer: "", detail: "" },
  transfer: { selections: [], other: "", hasFile: "" },
  automation: { selections: [], other: "", detail: "" },
  specialProcess: "",
  services: { selections: [], other: "" },
  blockers: { selections: [], other: "" },
  startTiming: "",
  startTimingOther: "",
  extraNotes: "",
};

export const RELEVANT_OPTIONS = [
  { value: "crm", label: "CRM וניהול לקוחות", icon: "👥" },
  { value: "leads", label: "ניהול לידים", icon: "🎯" },
  { value: "automations", label: "אוטומציות", icon: "⚡" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "website", label: "בניית אתר", icon: "🌐" },
  { value: "tasks_meetings", label: "ניהול משימות ופגישות", icon: "📅" },
  { value: "collab", label: "שיתופי פעולה", icon: "🤝" },
  { value: "advisor", label: "היועץ העסקי", icon: "🧠" },
  { value: "full_system", label: "מערכת מלאה", icon: "✨" },
  { value: "other", label: "אחר", icon: "➕" },
] as const;

export const GOAL_OPTIONS = [
  { value: "more_leads", label: "להביא ולטפל ביותר לידים", icon: "📈" },
  { value: "organize", label: "לעשות סדר בניהול העסק", icon: "🗂️" },
  { value: "save_time", label: "לחסוך זמן", icon: "⏱️" },
  { value: "client_followup", label: "לשפר מעקב אחרי לקוחות", icon: "👀" },
  { value: "sales_process", label: "לשפר את תהליך המכירה", icon: "💼" },
  { value: "website", label: "להקים או לשפר אתר", icon: "🌐" },
  { value: "automate", label: "להפוך פעולות לאוטומטיות", icon: "⚡" },
  { value: "more_collab", label: "ליצור יותר שיתופי פעולה", icon: "🤝" },
  { value: "other", label: "אחר", icon: "➕" },
] as const;

export const AUTOMATION_OPTIONS = [
  { value: "new_lead_msg", label: "הודעה אוטומטית לליד חדש", icon: "📩" },
  { value: "unanswered_followup", label: "Follow-up ללידים שלא ענו", icon: "🔁" },
  { value: "client_reminders", label: "תזכורות ללקוחות", icon: "🔔" },
  { value: "internal_reminders", label: "תזכורות פנימיות", icon: "⏰" },
  { value: "task_creation", label: "יצירת משימות", icon: "📝" },
  { value: "auto_status", label: "שינוי סטטוס אוטומטי", icon: "🏷️" },
  { value: "meeting_reminders", label: "תיאום / תזכורת לפגישה", icon: "📆" },
  { value: "whatsapp_msgs", label: "הודעות WhatsApp", icon: "💬" },
  { value: "internal_flows", label: "תהליכים פנימיים בעסק", icon: "⚙️" },
  { value: "other", label: "אחר", icon: "➕" },
  { value: "not_needed", label: "לא צריך כרגע", icon: "—" },
] as const;

export const TRANSFER_OPTIONS = [
  { value: "clients", label: "לקוחות", icon: "👥" },
  { value: "leads", label: "לידים", icon: "🎯" },
  { value: "tasks", label: "משימות", icon: "✅" },
  { value: "meetings", label: "פגישות", icon: "📅" },
  { value: "website_content", label: "תוכן מאתר קיים", icon: "🌐" },
  { value: "sales_stages", label: "סטטוסים / שלבי מכירה", icon: "🏷️" },
  { value: "other", label: "אחר", icon: "➕" },
  { value: "none", label: "אין צורך להעביר מידע", icon: "—" },
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
  { value: "migration", label: "מעבר ממערכת קיימת", icon: "🔄" },
  { value: "onboarding_time", label: "זמן להטמעה", icon: "⏳" },
  { value: "missing_feature", label: "חסר לי משהו במערכת", icon: "🧩" },
  { value: "need_more_info", label: "צריך להבין יותר איך זה יעבוד אצלנו", icon: "📋" },
  { value: "need_consult", label: "צריך להתייעץ עם אדם נוסף", icon: "👥" },
  { value: "not_sure_fit", label: "עדיין לא בטוח/ה שזה מתאים לעסק", icon: "🤔" },
  { value: "nothing_blocking", label: "אין כרגע משהו שמעכב אותי", icon: "✅" },
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
  { value: "yes", label: "כן" },
  { value: "no", label: "לא" },
  { value: "unsure", label: "לא בטוח/ה" },
] as const;

export const FILE_OPTIONS = [
  { value: "yes", label: "כן" },
  { value: "no", label: "לא" },
  { value: "unknown", label: "לא יודע/ת" },
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
  "summary",
  "success",
] as const;
export type StepKey = (typeof STEP_ORDER)[number];

export const QUESTION_STEPS = STEP_ORDER.filter(
  (s) => !["intro", "summary", "success"].includes(s)
) as readonly Exclude<StepKey, "intro" | "summary" | "success">[];

export function isStepKey(value: unknown): value is StepKey {
  return typeof value === "string" && (STEP_ORDER as readonly string[]).includes(value);
}

function asGroup(
  raw: any,
  fallback: { selections: string[]; other: string; note?: string; detail?: string; hasFile?: string }
) {
  return {
    ...fallback,
    ...(raw && typeof raw === "object" ? raw : {}),
  };
}

export function mergeAnswers(raw: any): PostDemoAnswers {
  const base = JSON.parse(JSON.stringify(EMPTY_ANSWERS)) as PostDemoAnswers;
  if (!raw || typeof raw !== "object") return base;

  const relevant = asGroup(raw.relevant || raw.relevant, base.relevant);
  const automation = asGroup(raw.automation || raw.automation, base.automation);
  const services = asGroup(raw.services, base.services);
  const blockers = asGroup(raw.blockers || raw.blockers, base.blockers);
  const currentToolRaw = raw.currentTool || raw.migration || {};
  const transferRaw = raw.transfer || {};

  return {
    ...base,
    relevant: {
      selections: Array.isArray(relevant.selections) ? relevant.selections : [],
      other: String(relevant.other || ""),
      note: String(relevant.note || ""),
    },
    goals: {
      selections: Array.isArray(raw.goals?.selections) ? raw.goals.selections : [],
      other: String(raw.goals?.other || ""),
    },
    currentTool: {
      answer: (currentToolRaw.answer || "") as TriAnswer,
      detail: String(currentToolRaw.detail || ""),
    },
    transfer: {
      selections: Array.isArray(transferRaw.selections) ? transferRaw.selections : [],
      other: String(transferRaw.other || ""),
      hasFile: (transferRaw.hasFile || "") as FileAnswer,
    },
    automation: {
      selections: Array.isArray(automation.selections) ? automation.selections : [],
      other: String(automation.other || ""),
      detail: String(automation.detail || ""),
    },
    specialProcess: String(raw.specialProcess ?? raw.workflowFit ?? raw.workflowFit ?? ""),
    services: {
      selections: Array.isArray(services.selections) ? services.selections : [],
      other: String(services.other || ""),
    },
    blockers: {
      selections: Array.isArray(blockers.selections) ? blockers.selections : [],
      other: String(blockers.other || ""),
    },
    startTiming: String(raw.startTiming ?? raw.startTiming ?? ""),
    startTimingOther: String(raw.startTimingOther ?? raw.startTimingOther ?? ""),
    extraNotes: String(raw.extraNotes ?? raw.extraNotes ?? ""),
    mainGoal: raw.mainGoal ? String(raw.mainGoal) : undefined,
    ...(raw.missing
      ? {
          missing: {
            answer: String(raw.missing.answer || "") as TriAnswer,
            detail: String(raw.missing.detail || ""),
          },
        }
      : {}),
    ...(raw.unclear ? { unclear: String(raw.unclear) } : {}),
    ...(raw.integrations
      ? {
          integrations: {
            answer: String(raw.integrations.answer || "") as TriAnswer,
            detail: String(raw.integrations.detail || ""),
          },
        }
      : {}),
  };
}

export function wantsCrmOrLeads(answers: PostDemoAnswers) {
  return answers.relevant.selections.some((value) => value === "crm" || value === "leads");
}

export function toggleExclusive(list: string[], value: string, exclusiveValue: string) {
  if (value === exclusiveValue) {
    return list.includes(value) ? [] : [value];
  }
  const next = list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list.filter((item) => item !== exclusiveValue), value];
  return next;
}
