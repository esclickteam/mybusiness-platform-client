/**
 * System-linked automation catalog for BizUply.
 * Maps real CRM / appointments / WhatsApp / AI capabilities to
 * clear Trigger → Result flows (no abstract "paths").
 */

import type { TFunction } from "i18next";
import i18n from "../../../../i18n/i18n";
import { listSupportedAiTemplates } from "./aiAutomationCatalog";
import {
  aiTemplateDescription,
  aiTemplateTitle,
} from "../../../../i18n/aiAutomationLabels";

type TranslateFn = TFunction;

export type SystemAutomationKind =
  | "standard"
  | "ai"
  | "whatsapp_simple"
  | "reminder";

export type SystemAutomationSuggestion = {
  id: string;
  /** Backend recipe key when one exists */
  recipeKey?: string;
  /** WhatsApp simple-automation trigger when relevant */
  whatsappTrigger?: string;
  kind: SystemAutomationKind;
  title: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
  categories: Array<
    "crm" | "appointments" | "email" | "whatsapp" | "sales" | "store" | "ai"
  >;
  /** Recommended WhatsApp template category (for gap reporting) */
  recommendedWaCategory?:
    | "appointment_reminder"
    | "promotion"
    | "follow_up"
    | "welcome"
    | "custom";
  /** Recommended Meta/local template name hints */
  recommendedTemplateHints?: string[];
  timingHint?: string;
  comingSoon?: boolean;
  requiresAi?: boolean;
};

type SystemAutomationDef = Omit<
  SystemAutomationSuggestion,
  "title" | "description" | "triggerLabel" | "resultLabels" | "timingHint"
> & { resultCount: number; hasTiming?: boolean };

const SYSTEM_AUTOMATION_DEFS: SystemAutomationDef[] = [
  {
    id: "lead_multi_route",
    recipeKey: "lead_multi_route",
    kind: "standard",
    resultCount: 3,
    categories: ["crm", "whatsapp"],
    recommendedWaCategory: "welcome",
    recommendedTemplateHints: ["new_lead_welcome"],
  },
  {
    id: "lead_no_response",
    recipeKey: "lead_no_response",
    whatsappTrigger: "new_lead_welcome",
    kind: "standard",
    resultCount: 3,
    hasTiming: true,
    categories: ["crm", "whatsapp", "sales"],
    recommendedWaCategory: "welcome",
    recommendedTemplateHints: [
      "new_lead_welcome",
      "lead_follow_up",
      "lead_follow_up_2",
    ],
  },
  {
    id: "new_client_welcome",
    recipeKey: "new_client_welcome",
    whatsappTrigger: "new_client_welcome",
    kind: "standard",
    resultCount: 2,
    categories: ["crm", "whatsapp"],
    recommendedWaCategory: "welcome",
    recommendedTemplateHints: ["welcome", "new_client"],
  },
  {
    id: "appointment_duo",
    recipeKey: "appointment_duo",
    kind: "standard",
    resultCount: 3,
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder", "thanks"],
  },
  {
    id: "appointment_gcal_sync",
    kind: "standard",
    resultCount: 1,
    categories: ["appointments"],
  },
  {
    id: "appointment_email_confirm",
    kind: "standard",
    resultCount: 1,
    categories: ["appointments", "email"],
  },
  {
    id: "lead_email_welcome",
    kind: "standard",
    resultCount: 2,
    categories: ["crm", "email"],
  },
  {
    id: "appointment_reminder_1_day",
    whatsappTrigger: "appointment_reminder_1_day",
    kind: "reminder",
    resultCount: 1,
    hasTiming: true,
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder"],
  },
  {
    id: "appointment_reminder_2_days",
    whatsappTrigger: "appointment_reminder_hours",
    kind: "reminder",
    resultCount: 1,
    hasTiming: true,
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder"],
  },
  {
    id: "appointment_reminder_hours",
    whatsappTrigger: "appointment_reminder_hours",
    kind: "reminder",
    resultCount: 1,
    hasTiming: true,
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "appointment_reminder",
    recommendedTemplateHints: ["appointment_reminder"],
  },
  {
    id: "appointment_thanks",
    whatsappTrigger: "appointment_thanks",
    kind: "whatsapp_simple",
    resultCount: 1,
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "custom",
    recommendedTemplateHints: ["thanks", "thank_you"],
  },
  {
    id: "appointment_review",
    whatsappTrigger: "appointment_review_request",
    kind: "whatsapp_simple",
    resultCount: 1,
    categories: ["appointments", "whatsapp"],
    recommendedWaCategory: "custom",
    recommendedTemplateHints: ["review", "feedback"],
  },
  {
    id: "lead_followup_2",
    whatsappTrigger: "lead_followup_2",
    kind: "whatsapp_simple",
    resultCount: 1,
    hasTiming: true,
    comingSoon: true,
    categories: ["crm", "whatsapp"],
    recommendedWaCategory: "follow_up",
    recommendedTemplateHints: ["lead_follow_up_2"],
  },
  {
    id: "inactive_client",
    whatsappTrigger: "inactive_client",
    kind: "whatsapp_simple",
    resultCount: 1,
    categories: ["crm", "whatsapp"],
    recommendedWaCategory: "follow_up",
    recommendedTemplateHints: ["inactive", "follow_up"],
  },
];

function localizeSystemRow(
  def: SystemAutomationDef,
  t: TranslateFn
): SystemAutomationSuggestion {
  const base = `automations.catalog.system.${def.id}`;
  const { resultCount, hasTiming, ...rest } = def;
  return {
    ...rest,
    title: t(`${base}.title`),
    description: t(`${base}.description`),
    triggerLabel: t(`${base}.trigger`),
    resultLabels: Array.from({ length: resultCount }, (_, index) =>
      t(`${base}.results.${index}`)
    ),
    ...(hasTiming ? { timingHint: t(`${base}.timing`) } : {}),
  };
}

export function getSystemAutomationCatalog(
  t: TranslateFn = i18n.t.bind(i18n)
): SystemAutomationSuggestion[] {
  const rows = SYSTEM_AUTOMATION_DEFS.map((def) => localizeSystemRow(def, t));
  rows.push(
    ...listSupportedAiTemplates().map((template) => ({
      id: template.templateKey,
      recipeKey: template.recipeKey,
      kind: "ai" as const,
      title: aiTemplateTitle(t, template),
      description: aiTemplateDescription(t, template),
      triggerLabel: template.customerExplanation.startsWhen,
      resultLabels: [
        template.customerExplanation.aiDoes,
        template.customerExplanation.afterwards,
      ],
      categories: (template.recommendedTrigger === "scheduled"
        ? ["ai", "crm"]
        : ["ai", "crm", "sales"]) as SystemAutomationSuggestion["categories"],
      requiresAi: false,
    }))
  );
  return rows;
}

export const SYSTEM_AUTOMATION_CATALOG: SystemAutomationSuggestion[] =
  getSystemAutomationCatalog();

export type MessageTemplateGap = {
  id: string;
  category: NonNullable<SystemAutomationSuggestion["recommendedWaCategory"]>;
  title: string;
  reason: string;
  relatedAutomationIds: string[];
  hintNames: string[];
};

type RequiredWhatsAppTemplateDef = {
  id: string;
  category: MessageTemplateGap["category"];
  hintNames: string[];
  relatedAutomationIds: string[];
  suggestedMetaName: string;
};

const REQUIRED_WHATSAPP_TEMPLATE_DEFS: RequiredWhatsAppTemplateDef[] = [
  {
    id: "wa_welcome_lead",
    category: "welcome",
    hintNames: ["new_lead_welcome"],
    relatedAutomationIds: ["lead_multi_route", "wa_new_lead_welcome"],
    suggestedMetaName: "new_lead_welcome",
  },
  {
    id: "wa_welcome_client",
    category: "welcome",
    hintNames: ["new_client_welcome"],
    relatedAutomationIds: ["new_client_welcome", "wa_new_client_welcome"],
    suggestedMetaName: "new_client_welcome",
  },
  {
    id: "wa_appointment_reminder",
    category: "appointment_reminder",
    hintNames: ["appointment_reminder"],
    relatedAutomationIds: [
      "appointment_duo",
      "appointment_reminder_1_day",
      "appointment_reminder_2_days",
      "appointment_reminder_hours",
    ],
    suggestedMetaName: "appointment_reminder",
  },
  {
    id: "wa_appointment_confirmation",
    category: "custom",
    hintNames: ["appointment_confirmation"],
    relatedAutomationIds: ["appointment_duo", "wf_appointment_duo"],
    suggestedMetaName: "appointment_confirmation",
  },
  {
    id: "wa_appointment_thanks",
    category: "custom",
    hintNames: ["appointment_thanks"],
    relatedAutomationIds: ["appointment_thanks", "wa_appointment_thanks"],
    suggestedMetaName: "appointment_thanks",
  },
  {
    id: "wa_appointment_review",
    category: "custom",
    hintNames: ["appointment_review"],
    relatedAutomationIds: ["appointment_review", "wa_appointment_review"],
    suggestedMetaName: "appointment_review",
  },
  {
    id: "wa_follow_up",
    category: "follow_up",
    hintNames: ["lead_follow_up"],
    relatedAutomationIds: ["lead_no_response", "wa_lead_no_response"],
    suggestedMetaName: "lead_follow_up",
  },
  {
    id: "wa_follow_up_2",
    category: "follow_up",
    hintNames: ["lead_follow_up_2"],
    relatedAutomationIds: ["lead_followup_2", "wa_lead_followup_2"],
    suggestedMetaName: "lead_follow_up_2",
  },
  {
    id: "wa_inactive_client",
    category: "follow_up",
    hintNames: ["inactive_client"],
    relatedAutomationIds: ["inactive_client", "wa_inactive_client"],
    suggestedMetaName: "inactive_client",
  },
];

export function getRequiredWhatsAppMessageTemplates(
  t: TranslateFn = i18n.t.bind(i18n)
): Array<{
  id: string;
  category: MessageTemplateGap["category"];
  title: string;
  reason: string;
  hintNames: string[];
  relatedAutomationIds: string[];
  suggestedMetaName: string;
}> {
  return REQUIRED_WHATSAPP_TEMPLATE_DEFS.map((def) => ({
    ...def,
    title: t(`automations.catalog.waRequired.${def.id}.title`),
    reason: t(`automations.catalog.waRequired.${def.id}.reason`),
  }));
}

/** Full checklist of WhatsApp message templates businesses should prepare. */
export const REQUIRED_WHATSAPP_MESSAGE_TEMPLATES =
  getRequiredWhatsAppMessageTemplates();

/** @deprecated use REQUIRED_WHATSAPP_MESSAGE_TEMPLATES */
const REQUIRED_TEMPLATE_GROUPS = REQUIRED_WHATSAPP_MESSAGE_TEMPLATES;

export type WaTemplateLike = {
  name?: string;
  key?: string;
  category?: string;
  metaTemplateName?: string;
  status?: string;
  metaStatus?: string;
};

function templateMatchesHints(tpl: WaTemplateLike, hints: string[]) {
  const hay = [
    tpl.name,
    tpl.key,
    tpl.metaTemplateName,
    tpl.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hints.some((hint) => hay.includes(hint.toLowerCase()));
}

function isUsableTemplate(tpl: WaTemplateLike) {
  const status = String(tpl.status || "").toLowerCase();
  const meta = String(tpl.metaStatus || "").toLowerCase();
  if (status === "archived") return false;
  if (meta && meta !== "approved" && meta !== "active" && status !== "active") {
    // Keep drafts that are local-active; ignore clearly rejected Meta templates.
    if (meta === "rejected" || meta === "paused" || meta === "disabled") {
      return false;
    }
  }
  return true;
}

/**
 * Compare business WhatsApp templates against automations the product supports.
 */
export type RequiredWhatsAppMessageTemplateStatus = {
  id: string;
  category: MessageTemplateGap["category"];
  title: string;
  reason: string;
  suggestedMetaName: string;
  hintNames: string[];
  relatedAutomationIds: string[];
  prepared: boolean;
  matchedTemplateName?: string;
};

/** Full required WhatsApp message-template checklist with prepared status. */
export function listRequiredWhatsAppMessageTemplates(
  templates: WaTemplateLike[] = [],
  t: TranslateFn = i18n.t.bind(i18n)
): RequiredWhatsAppMessageTemplateStatus[] {
  const usable = (templates || []).filter(isUsableTemplate);
  return getRequiredWhatsAppMessageTemplates(t).map((group) => {
    // Prefer name/key hints so each checklist row is independently prepared.
    const match =
      usable.find(
        (tpl) =>
          String(tpl.metaTemplateName || "").toLowerCase() ===
          group.suggestedMetaName.toLowerCase()
      ) || usable.find((tpl) => templateMatchesHints(tpl, group.hintNames)) || null;
    return {
      id: group.id,
      category: group.category,
      title: group.title,
      reason: group.reason,
      suggestedMetaName: group.suggestedMetaName,
      hintNames: group.hintNames,
      relatedAutomationIds: group.relatedAutomationIds,
      prepared: Boolean(match),
      matchedTemplateName: match
        ? String(match.name || match.key || match.metaTemplateName || "")
        : undefined,
    };
  });
}

export function findMissingMessageTemplates(
  templates: WaTemplateLike[]
): MessageTemplateGap[] {
  return listRequiredWhatsAppMessageTemplates(templates)
    .filter((row) => !row.prepared)
    .map((row) => ({
      id: row.id,
      category: row.category,
      title: row.title,
      reason: row.reason,
      relatedAutomationIds: row.relatedAutomationIds,
      hintNames: row.hintNames,
    }));
}

export function getCatalogByRecipeKey(recipeKey: string) {
  return SYSTEM_AUTOMATION_CATALOG.find((row) => row.recipeKey === recipeKey);
}

export function listAiAutomations() {
  return SYSTEM_AUTOMATION_CATALOG.filter((row) => row.kind === "ai");
}

export function listReminderAutomations() {
  return SYSTEM_AUTOMATION_CATALOG.filter((row) => row.kind === "reminder");
}
