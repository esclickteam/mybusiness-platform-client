import type { AutomationRecipeSummary } from "../../../../api/automationWorkflowApi";

export type TemplateCategoryId =
  | "all"
  | "leads"
  | "crm"
  | "appointments"
  | "email"
  | "whatsapp"
  | "sales"
  | "ai";

export type TemplateCategory = {
  id: TemplateCategoryId;
  label: string;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "all", label: "הכל" },
  { id: "leads", label: "לידים" },
  { id: "crm", label: "CRM" },
  { id: "appointments", label: "פגישות" },
  { id: "email", label: "מייל" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "sales", label: "מכירות" },
  { id: "ai", label: "AI" },
];

/**
 * Local UI mapping from known recipe keys to browse categories.
 * Derived from recipe keys + known trigger intent — not inventing backend fields.
 */
const RECIPE_CATEGORY_MAP: Record<string, TemplateCategoryId[]> = {
  lead_multi_route: ["leads", "crm", "whatsapp"],
  lead_no_response: ["leads", "whatsapp"],
  appointment_duo: ["appointments"],
  new_client_welcome: ["crm"],
  ai_rank_leads: ["ai", "leads"],
  ai_summarize_calls: ["ai", "appointments"],
  ai_auto_reply: ["ai", "whatsapp"],
  ai_risk_lead: ["ai", "leads"],
  ai_campaign_change: ["ai", "leads", "sales"],
  ai_tasks_from_chat: ["ai", "crm", "appointments"],
};

const RECIPE_TRIGGER_LABEL: Record<string, string> = {
  lead_multi_route: "ליד חדש ב-CRM",
  lead_no_response: "ליד שלא נענה",
  appointment_duo: "פגישה חדשה / תזכורת",
  new_client_welcome: "לקוח חדש",
  ai_rank_leads: "ליד חדש ב-CRM",
  ai_summarize_calls: "פגישה הסתיימה",
  ai_auto_reply: "הודעת WhatsApp",
  ai_risk_lead: "פולואפ לליד",
  ai_campaign_change: "שינוי סטטוס ליד",
  ai_tasks_from_chat: "פגישה הסתיימה",
};

export function getRecipeCategories(
  recipe: AutomationRecipeSummary
): TemplateCategoryId[] {
  const mapped = RECIPE_CATEGORY_MAP[recipe.key];
  if (mapped?.length) return mapped;
  if (recipe.tier === "ai_paid" || recipe.isAiRecipe) return ["ai"];
  return [];
}

export function getRecipeTriggerLabel(recipe: AutomationRecipeSummary): string {
  if (RECIPE_TRIGGER_LABEL[recipe.key]) return RECIPE_TRIGGER_LABEL[recipe.key];
  if (recipe.triggerCount > 1) return `${recipe.triggerCount} טריגרים`;
  return "טריגר";
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
