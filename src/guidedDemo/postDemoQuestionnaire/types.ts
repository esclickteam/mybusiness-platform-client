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
  { value: "crm", labelKey: "leftover.guidedQ.relevantCrm", label: "CRM וניהול לקוחות", icon: "👥" },
  { value: "leads", labelKey: "leftover.guidedQ.relevantLeads", label: "ניהול לידים", icon: "🎯" },
  { value: "automations", labelKey: "leftover.guidedQ.relevantAuto", label: "אוטומציות", icon: "⚡" },
  { value: "whatsapp", labelKey: "leftover.guidedQ.relevantWhatsapp", label: "WhatsApp", icon: "💬" },
  { value: "website", labelKey: "leftover.guidedQ.relevantWebsite", label: "בניית אתר", icon: "🌐" },
  { value: "tasks_meetings", labelKey: "leftover.guidedQ.relevantTasks", label: "ניהול משימות ופגישות", icon: "📅" },
  { value: "collab", labelKey: "leftover.guidedQ.relevantCollab", label: "שיתופי פעולה", icon: "🤝" },
  { value: "advisor", labelKey: "leftover.guidedQ.relevantAdvisor", label: "היועץ העסקי", icon: "🧠" },
  { value: "full_system", labelKey: "leftover.guidedQ.relevantFull", label: "מערכת מלאה", icon: "✨" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר", icon: "➕" },
] as const;

export const GOAL_OPTIONS = [
  { value: "more_leads", labelKey: "leftover.guidedQ.goalLeads", label: "להביא ולטפל ביותר לידים", icon: "📈" },
  { value: "organize", labelKey: "leftover.guidedQ.goalOrganize", label: "לעשות סדר בניהול העסק", icon: "🗂️" },
  { value: "save_time", labelKey: "leftover.guidedQ.goalTime", label: "לחסוך זמן", icon: "⏱️" },
  { value: "client_followup", labelKey: "leftover.guidedQ.goalFollowup", label: "לשפר מעקב אחרי לקוחות", icon: "👀" },
  { value: "sales_process", labelKey: "leftover.guidedQ.goalSales", label: "לשפר את תהליך המכירה", icon: "💼" },
  { value: "website", labelKey: "leftover.guidedQ.goalWebsite", label: "להקים או לשפר אתר", icon: "🌐" },
  { value: "automate", labelKey: "leftover.guidedQ.goalAutomate", label: "להפוך פעולות לאוטומטיות", icon: "⚡" },
  { value: "more_collab", labelKey: "leftover.guidedQ.goalCollab", label: "ליצור יותר שיתופי פעולה", icon: "🤝" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר", icon: "➕" },
] as const;

export const AUTOMATION_OPTIONS = [
  { value: "new_lead_msg", labelKey: "leftover.guidedQ.autoNewLead", label: "הודעה אוטומטית לליד חדש", icon: "📩" },
  { value: "unanswered_followup", labelKey: "leftover.guidedQ.autoFollowup", label: "Follow-up ללידים שלא ענו", icon: "🔁" },
  { value: "client_reminders", labelKey: "leftover.guidedQ.autoClientReminders", label: "תזכורות ללקוחות", icon: "🔔" },
  { value: "internal_reminders", labelKey: "leftover.guidedQ.autoInternalReminders", label: "תזכורות פנימיות", icon: "⏰" },
  { value: "task_creation", labelKey: "leftover.guidedQ.autoTasks", label: "יצירת משימות", icon: "📝" },
  { value: "auto_status", labelKey: "leftover.guidedQ.autoStatus", label: "שינוי סטטוס אוטומטי", icon: "🏷️" },
  { value: "meeting_reminders", labelKey: "leftover.guidedQ.autoMeetings", label: "תיאום / תזכורת לפגישה", icon: "📆" },
  { value: "whatsapp_msgs", labelKey: "leftover.guidedQ.autoWhatsapp", label: "הודעות WhatsApp", icon: "💬" },
  { value: "internal_flows", labelKey: "leftover.guidedQ.autoInternal", label: "תהליכים פנימיים בעסק", icon: "⚙️" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר", icon: "➕" },
  { value: "not_needed", labelKey: "leftover.guidedQ.notNeeded", label: "לא צריך כרגע", icon: "—" },
] as const;

export const TRANSFER_OPTIONS = [
  { value: "clients", labelKey: "leftover.guidedQ.transferClients", label: "לקוחות", icon: "👥" },
  { value: "leads", labelKey: "leftover.guidedQ.transferLeads", label: "לידים", icon: "🎯" },
  { value: "tasks", labelKey: "leftover.guidedQ.transferTasks", label: "משימות", icon: "✅" },
  { value: "meetings", labelKey: "leftover.guidedQ.transferMeetings", label: "פגישות", icon: "📅" },
  { value: "website_content", labelKey: "leftover.guidedQ.transferWebsite", label: "תוכן מאתר קיים", icon: "🌐" },
  { value: "sales_stages", labelKey: "leftover.guidedQ.transferStages", label: "סטטוסים / שלבי מכירה", icon: "🏷️" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר", icon: "➕" },
  { value: "none", labelKey: "leftover.guidedQ.transferNone", label: "אין צורך להעביר מידע", icon: "—" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "website_build", labelKey: "leftover.guidedQ.serviceWebsite", label: "בניית אתר", icon: "🌐" },
  { value: "automation_build", labelKey: "leftover.guidedQ.serviceAuto", label: "בניית אוטומציות", icon: "⚡" },
  { value: "sales_agents", labelKey: "leftover.guidedQ.serviceAgents", label: "נציגי מכירות שחוזרים ללידים", icon: "📞" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר", icon: "➕" },
  { value: "not_now", labelKey: "leftover.guidedQ.notNow", label: "לא כרגע", icon: "—" },
] as const;

export const BLOCKER_OPTIONS = [
  { value: "price", labelKey: "leftover.guidedQ.blockerPrice", label: "המחיר", icon: "💰" },
  { value: "migration", labelKey: "leftover.guidedQ.blockerMigration", label: "מעבר ממערכת קיימת", icon: "🔄" },
  { value: "onboarding_time", labelKey: "leftover.guidedQ.blockerTime", label: "זמן להטמעה", icon: "⏳" },
  { value: "missing_feature", labelKey: "leftover.guidedQ.blockerMissing", label: "חסר לי משהו במערכת", icon: "🧩" },
  { value: "need_more_info", labelKey: "leftover.guidedQ.blockerInfo", label: "צריך להבין יותר איך זה יעבוד אצלנו", icon: "📋" },
  { value: "need_consult", labelKey: "leftover.guidedQ.blockerConsult", label: "צריך להתייעץ עם אדם נוסף", icon: "👥" },
  { value: "not_sure_fit", labelKey: "leftover.guidedQ.blockerFit", label: "עדיין לא בטוח/ה שזה מתאים לעסק", icon: "🤔" },
  { value: "nothing_blocking", labelKey: "leftover.guidedQ.blockerNone", label: "אין כרגע משהו שמעכב אותי", icon: "✅" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר", icon: "➕" },
] as const;

export const START_TIMING_OPTIONS = [
  { value: "asap", labelKey: "leftover.guidedQ.timingAsap", label: "בהקדם האפשרי" },
  { value: "soon", labelKey: "leftover.guidedQ.timingSoon", label: "בימים הקרובים" },
  { value: "this_month", labelKey: "leftover.guidedQ.timingMonth", label: "במהלך החודש" },
  { value: "next_month", labelKey: "leftover.guidedQ.timingNextMonth", label: "בחודש הבא" },
  { value: "later", labelKey: "leftover.guidedQ.timingLater", label: "בהמשך" },
  { value: "unknown", labelKey: "leftover.guidedQ.timingUnknown", label: "עדיין לא יודע/ת" },
  { value: "other", labelKey: "leftover.guidedQ.other", label: "אחר" },
] as const;

export const TRI_OPTIONS = [
  { value: "yes", labelKey: "leftover.guidedQ.yes", label: "כן" },
  { value: "no", labelKey: "leftover.guidedQ.no", label: "לא" },
  { value: "unsure", labelKey: "leftover.guidedQ.unsure", label: "לא בטוח/ה" },
] as const;

export const FILE_OPTIONS = [
  { value: "yes", labelKey: "leftover.guidedQ.yes", label: "כן" },
  { value: "no", labelKey: "leftover.guidedQ.no", label: "לא" },
  { value: "unknown", labelKey: "leftover.guidedQ.unknown", label: "לא יודע/ת" },
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
