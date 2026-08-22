export type SelectionBlock = {
  selections: string[];
  other: string;
  note: string;
  detail: string;
};

export type IntroQuestionnaire = {
  businessDescription: string;
  missingNeeds: SelectionBlock;
  currentManagement: string;
  workingGaps: string;
  marketing: {
    answer: string;
    other: string;
    channels: SelectionBlock;
  };
  leadSources: SelectionBlock;
  inquiryFlow: string;
  bottlenecks: SelectionBlock;
  automationWishes: string;
  website: {
    status: string;
    other: string;
    satisfaction: string;
    improvements: SelectionBlock;
    note: string;
  };
  team: {
    handler: string;
    other: string;
    userCount: string;
  };
  demoFocus: SelectionBlock;
  oneThingTomorrow: string;
  internalNotes: string;
};

export type CallSummaryPayload = {
  introQuestionnaire?: IntroQuestionnaire | null;
  summaryMeta?: {
    createdAt?: string | null;
    updatedAt?: string | null;
    createdByName?: string;
    updatedByName?: string;
  };
};

export const MISSING_NEEDS_OPTIONS = [
  { value: "lead_order", label: "סדר וניהול לידים" },
  { value: "customer_tracking", label: "מעקב אחרי לקוחות" },
  { value: "crm", label: "CRM" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "automations", label: "אוטומציות" },
  { value: "scheduling", label: "תיאום פגישות" },
  { value: "tasks", label: "ניהול משימות" },
  { value: "team", label: "ניהול צוות" },
  { value: "website", label: "אתר" },
  { value: "online_store", label: "חנות אונליין" },
  { value: "quotes_sales", label: "מעקב אחרי הצעות מחיר / מכירות" },
  { value: "centralization", label: "ריכוז כל הפעילות במקום אחד" },
  { value: "other", label: "אחר" },
] as const;

export const MARKETING_ANSWER_OPTIONS = [
  { value: "yes_regular", label: "כן, באופן קבוע" },
  { value: "yes_sometimes", label: "כן, מדי פעם" },
  { value: "not_now", label: "לא כרגע" },
  { value: "other", label: "אחר" },
] as const;

export const MARKETING_CHANNEL_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "website", label: "אתר" },
  { value: "organic", label: "תוכן אורגני" },
  { value: "influencers", label: "משפיענים" },
  { value: "outreach", label: "דיוור / SMS / WhatsApp" },
  { value: "other", label: "אחר" },
] as const;

export const LEAD_SOURCE_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "lead_forms", label: "טפסי לידים" },
  { value: "website", label: "אתר" },
  { value: "google", label: "Google" },
  { value: "phone", label: "טלפון" },
  { value: "referrals", label: "המלצות" },
  { value: "returning", label: "לקוחות חוזרים" },
  { value: "other", label: "אחר" },
] as const;

export const BOTTLENECK_OPTIONS = [
  { value: "slow_response", label: "לא חוזרים מספיק מהר" },
  { value: "forgot_followup", label: "שוכחים לעשות Follow-up" },
  { value: "lost_leads", label: "לידים מתפספסים" },
  { value: "no_quote_tracking", label: "אין מעקב אחרי הצעות מחיר" },
  { value: "unclear_status", label: "קשה לדעת מי כבר טופל" },
  { value: "team_chaos", label: "אין סדר בין העובדים" },
  { value: "no_automations", label: "אין אוטומציות" },
  { value: "no_centralization", label: "אין ריכוז של כל המידע" },
  { value: "unknown_source", label: "קשה לדעת מאיפה הגיע כל ליד" },
  { value: "no_sales_process", label: "אין תהליך מכירה מסודר" },
  { value: "other", label: "אחר" },
] as const;

export const WEBSITE_STATUS_OPTIONS = [
  { value: "yes", label: "כן" },
  { value: "no", label: "לא" },
  { value: "in_progress", label: "בתהליך הקמה" },
  { value: "other", label: "אחר" },
] as const;

export const WEBSITE_SATISFACTION_OPTIONS = [
  { value: "yes", label: "כן" },
  { value: "partial", label: "חלקית" },
  { value: "no", label: "לא" },
] as const;

export const WEBSITE_IMPROVEMENT_OPTIONS = [
  { value: "design", label: "עיצוב" },
  { value: "more_leads", label: "יותר פניות" },
  { value: "forms", label: "טפסים" },
  { value: "scheduling", label: "תיאום פגישות" },
  { value: "store", label: "חנות" },
  { value: "crm", label: "חיבור ל-CRM" },
  { value: "automations", label: "אוטומציות" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "content", label: "ניהול תוכן" },
  { value: "seo", label: "SEO" },
  { value: "other", label: "אחר" },
] as const;

export const TEAM_HANDLER_OPTIONS = [
  { value: "owner_only", label: "רק בעל/ת העסק" },
  { value: "owner_employees", label: "בעל/ת העסק + עובדים" },
  { value: "sales_team", label: "צוות מכירות" },
  { value: "customer_service", label: "שירות לקוחות" },
  { value: "multiple_people", label: "כמה אנשים שונים" },
  { value: "other", label: "אחר" },
] as const;

export const DEMO_FOCUS_OPTIONS = [
  { value: "crm", label: "CRM" },
  { value: "leads", label: "ניהול לידים" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "automations", label: "Automations" },
  { value: "website", label: "Website" },
  { value: "scheduling", label: "Scheduling / תיאום פגישות" },
  { value: "tasks", label: "ניהול משימות" },
  { value: "team", label: "ניהול צוות" },
  { value: "full_system", label: "Full System" },
  { value: "other", label: "אחר" },
] as const;

export function emptySelectionBlock(): SelectionBlock {
  return { selections: [], other: "", note: "", detail: "" };
}

export function emptyIntroQuestionnaire(): IntroQuestionnaire {
  return {
    businessDescription: "",
    missingNeeds: emptySelectionBlock(),
    currentManagement: "",
    workingGaps: "",
    marketing: { answer: "", other: "", channels: emptySelectionBlock() },
    leadSources: emptySelectionBlock(),
    inquiryFlow: "",
    bottlenecks: emptySelectionBlock(),
    automationWishes: "",
    website: {
      status: "",
      other: "",
      satisfaction: "",
      improvements: emptySelectionBlock(),
      note: "",
    },
    team: { handler: "", other: "", userCount: "" },
    demoFocus: emptySelectionBlock(),
    oneThingTomorrow: "",
    internalNotes: "",
  };
}
