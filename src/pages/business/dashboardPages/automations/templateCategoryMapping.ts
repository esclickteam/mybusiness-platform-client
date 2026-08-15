import type { AutomationRecipeSummary } from "../../../../api/automationWorkflowApi";
import { getCatalogByRecipeKey } from "./systemAutomationCatalog";

export type TemplateCategoryId =
  | "all"
  | "crm"
  | "appointments"
  | "email"
  | "whatsapp"
  | "sales"
  | "store"
  | "ai";

export type TemplateCategory = {
  id: TemplateCategoryId;
  label: string;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "all", label: "הכל" },
  { id: "crm", label: "CRM" },
  { id: "appointments", label: "פגישות" },
  { id: "email", label: "מייל" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "sales", label: "מכירות" },
  { id: "store", label: "חנות" },
  { id: "ai", label: "AI" },
];

/**
 * Local UI mapping from known recipe keys to browse categories.
 * Derived from recipe keys + known trigger intent — not inventing backend fields.
 */
const RECIPE_CATEGORY_MAP: Record<string, TemplateCategoryId[]> = {
  lead_multi_route: ["crm", "whatsapp"],
  lead_no_response: ["crm", "whatsapp"],
  appointment_duo: ["appointments", "whatsapp"],
  new_client_welcome: ["crm", "whatsapp"],
  ai_rank_leads: ["ai", "crm"],
  ai_summarize_calls: ["ai", "appointments"],
  ai_auto_reply: ["ai", "whatsapp"],
  ai_risk_lead: ["ai", "crm"],
  ai_campaign_change: ["ai", "crm", "sales"],
  ai_tasks_from_chat: ["ai", "crm", "appointments"],
};

const RECIPE_TRIGGER_LABEL: Record<string, string> = {
  lead_multi_route: "ליד חדש ב-CRM",
  lead_no_response: "ליד חדש ב-CRM",
  appointment_duo: "פגישה חדשה",
  new_client_welcome: "לקוח חדש",
  ai_rank_leads: "ליד חדש ב-CRM",
  ai_summarize_calls: "פגישה הסתיימה",
  ai_auto_reply: "הודעת WhatsApp",
  ai_risk_lead: "פולואפ לליד",
  ai_campaign_change: "שינוי סטטוס ליד",
  ai_tasks_from_chat: "פגישה הסתיימה",
};

const RECIPE_RESULT_LABEL: Record<string, string> = {
  lead_multi_route: "WhatsApp מיידי · משימה לנציג · התראה לבעל העסק",
  lead_no_response: "פתיחה WhatsApp · פולואפ #1 · פולואפ #2",
  appointment_duo: "אישור WhatsApp · משימת הכנה · תזכורת יום לפני",
  new_client_welcome: "הודעת פתיחה · משימת שימור",
  ai_rank_leads: "דירוג AI · התראה",
  ai_summarize_calls: "סיכום AI ל-CRM",
  ai_auto_reply: "טיוטת תשובה AI",
  ai_risk_lead: "התראת ליד בסיכון",
  ai_campaign_change: "המלצת קמפיין AI",
  ai_tasks_from_chat: "משימות AI מתוך שיחה",
};

/** Override backend recipe copy that still talks about "paths/routes". */
const RECIPE_DISPLAY_NAME: Record<string, string> = {
  lead_multi_route: "ליד חדש — כמה תוצאות יחד",
  lead_no_response: "ליד חדש → פתיחה + פולואפים לפי תגובה",
  appointment_duo: "פגישה — אישור + תזכורת + משימה",
  new_client_welcome: "לקוח חדש — ברוכים הבאים",
  ai_rank_leads: "AI — דירוג ליד",
  ai_summarize_calls: "AI — סיכום שיחה",
  ai_auto_reply: "AI — טיוטת תשובה ל-WhatsApp",
  ai_risk_lead: "AI — ליד בסיכון",
  ai_campaign_change: "AI — המלצת קמפיין",
  ai_tasks_from_chat: "AI — משימות משיחה",
};

const RECIPE_DISPLAY_DESCRIPTION: Record<string, string> = {
  lead_multi_route:
    "טריגר ליד חדש ב-CRM. תוצאות יחד: WhatsApp מיידי, משימה לנציג והתראה לבעל העסק.",
  lead_no_response:
    "הודעת פתיחה נשלחת מיד. אם הליד לא מגיב, נשלח פולואפ לאחר 24 שעות ופולואפ נוסף לאחר 3 ימים.",
  appointment_duo:
    "טריגר פגישה חדשה. תוצאות: אישור WhatsApp, משימת הכנה, ותזכורת יום לפני המועד.",
  new_client_welcome:
    "טריגר לקוח חדש. תוצאות: הודעת פתיחה ומשימת שימור.",
  ai_rank_leads:
    "טריגר ליד חדש. תוצאה: דירוג AI לפי סיכוי ודחיפות + התראה.",
  ai_summarize_calls:
    "טריגר פגישה שהסתיימה. תוצאה: סיכום AI ותיעוד ב-CRM.",
  ai_auto_reply:
    "טריגר הודעת WhatsApp נכנסת. תוצאה: טיוטת תשובה AI מוכנה לשליחה.",
  ai_risk_lead:
    "טריגר פולואפ לליד. תוצאה: זיהוי ליד בסיכון והתראה מיידית.",
  ai_campaign_change:
    "טריגר שינוי סטטוס ליד. תוצאה: המלצת שינוי קמפיין מ-AI.",
  ai_tasks_from_chat:
    "טריגר פגישה שהסתיימה. תוצאה: משימות מעקב שנוצרו מתוך השיחה.",
};

export function getRecipeDisplayName(recipe: AutomationRecipeSummary): string {
  return RECIPE_DISPLAY_NAME[recipe.key] || recipe.name;
}

export function getRecipeDisplayDescription(
  recipe: AutomationRecipeSummary
): string {
  return RECIPE_DISPLAY_DESCRIPTION[recipe.key] || recipe.description;
}

export function getRecipeResultCount(recipe: AutomationRecipeSummary): number {
  const fromCatalog = getCatalogByRecipeKey(recipe.key)?.resultLabels?.length;
  if (fromCatalog && fromCatalog > 0) return fromCatalog;
  if (recipe.pathCount > 1) return recipe.pathCount;
  return 1;
}

export function getRecipeCategories(
  recipe: AutomationRecipeSummary
): TemplateCategoryId[] {
  const fromCatalog = getCatalogByRecipeKey(recipe.key)?.categories;
  if (fromCatalog?.length) return fromCatalog as TemplateCategoryId[];
  const mapped = RECIPE_CATEGORY_MAP[recipe.key];
  if (mapped?.length) return mapped;
  if (recipe.tier === "ai_paid" || recipe.isAiRecipe) return ["ai"];
  return [];
}

export function getRecipeTriggerLabel(recipe: AutomationRecipeSummary): string {
  const fromCatalog = getCatalogByRecipeKey(recipe.key)?.triggerLabel;
  if (fromCatalog) return fromCatalog;
  if (RECIPE_TRIGGER_LABEL[recipe.key]) return RECIPE_TRIGGER_LABEL[recipe.key];
  if (recipe.triggerCount > 1) return `${recipe.triggerCount} טריגרים`;
  return "טריגר";
}

export function getRecipeResultLabel(recipe: AutomationRecipeSummary): string {
  const fromCatalog = getCatalogByRecipeKey(recipe.key)?.resultLabels;
  if (fromCatalog?.length) return fromCatalog.join(" · ");
  if (RECIPE_RESULT_LABEL[recipe.key]) return RECIPE_RESULT_LABEL[recipe.key];
  if (recipe.pathCount > 1) return `${recipe.pathCount} תוצאות יחד`;
  return "תוצאה";
}

export function recipeMatchesCategory(
  recipe: AutomationRecipeSummary,
  category: TemplateCategoryId
): boolean {
  if (category === "all") return true;
  return getRecipeCategories(recipe).includes(category);
}

export function recipeMatchesQuery(
  recipe: AutomationRecipeSummary,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    recipe.name,
    recipe.description,
    getRecipeTriggerLabel(recipe),
    recipe.key,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function truncateDescription(text: string, max = 110): string {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}
