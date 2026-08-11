/**
 * Canonical resolver: WhatsApp automation card → approved Meta template.
 * UI readiness and Builder activation must use this — not a stale side list.
 */
import type {
  ApprovedWhatsAppTemplate,
  WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import {
  BLUEPRINT_PREFERRED_META,
  WA_DEFAULT_META_MAPPINGS,
  defaultMappingsForMetaTemplate,
  isBusinessAlertMetaTemplateName,
  isLegacyManagedMetaTemplateName,
  isTestTemplateName,
  type WaDefaultMapping,
} from "./whatsappAutomationMetaTemplates";

export const WA_TEMPLATE_UNAVAILABLE_HE =
  "אין תבנית WhatsApp מאושרת מתאימה לאוטומציה הזו";

export type ResolvedWaAutomationTemplate = {
  automationTemplateKey: string;
  preferredMetaName: string | null;
  metaTemplate: WhatsAppTemplate | ApprovedWhatsAppTemplate | null;
  metaTemplateName: string | null;
  metaStatus: string | null;
  metaCategory: string | null;
  language: string | null;
  variableCount: number;
  variableMappings: WaDefaultMapping[];
  recipientType: string;
  ready: boolean;
  whyNotReady: string | null;
};

function normalizeName(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isApprovedMeta(
  tpl: WhatsAppTemplate | ApprovedWhatsAppTemplate
): boolean {
  const meta = String(
    (tpl as WhatsAppTemplate).metaStatus ||
      (tpl as ApprovedWhatsAppTemplate).metaStatus ||
      ""
  )
    .trim()
    .toUpperCase();
  return meta === "APPROVED";
}

function templateMetaName(
  tpl: WhatsAppTemplate | ApprovedWhatsAppTemplate
): string {
  return normalizeName(
    (tpl as WhatsAppTemplate).metaTemplateName ||
      (tpl as ApprovedWhatsAppTemplate).metaTemplateName ||
      tpl.name ||
      tpl.key ||
      ""
  );
}

function countBodyVariables(
  tpl: WhatsAppTemplate | ApprovedWhatsAppTemplate
): number {
  const mappings = defaultMappingsForMetaTemplate(templateMetaName(tpl));
  if (mappings.length) return mappings.length;
  const vars = (tpl as WhatsAppTemplate).variables;
  if (Array.isArray(vars)) return vars.length;
  return 0;
}

function recipientTypeForMeta(metaName: string): string {
  const name = normalizeName(metaName);
  if (isBusinessAlertMetaTemplateName(name)) return "business_owner";
  if (
    name === "appointment_reminder" ||
    name === "appointment_thanks" ||
    name === "appointment_review"
  ) {
    return "appointment_customer_phone";
  }
  if (name === "new_client_welcome" || name === "inactive_client") {
    return "client_phone";
  }
  return "lead_phone";
}

/**
 * Find the approved managed/tenant Meta template for an automation blueprint key.
 * Priority: exact preferred Meta name → otherwise unavailable (no silent wrong pick).
 */
export function resolveApprovedMetaTemplateForAutomation(opts: {
  automationTemplateKey: string;
  preferredMetaName?: string | null;
  waTemplates: Array<WhatsAppTemplate | ApprovedWhatsAppTemplate>;
  allowBusinessAlert?: boolean;
}): ResolvedWaAutomationTemplate {
  const automationTemplateKey = String(opts.automationTemplateKey || "").trim();
  const preferredMetaName = normalizeName(
    opts.preferredMetaName ||
      BLUEPRINT_PREFERRED_META[automationTemplateKey] ||
      ""
  );

  const base: ResolvedWaAutomationTemplate = {
    automationTemplateKey,
    preferredMetaName: preferredMetaName || null,
    metaTemplate: null,
    metaTemplateName: null,
    metaStatus: null,
    metaCategory: null,
    language: null,
    variableCount: 0,
    variableMappings: [],
    recipientType: "lead_phone",
    ready: false,
    whyNotReady: WA_TEMPLATE_UNAVAILABLE_HE,
  };

  if (!preferredMetaName) {
    return base;
  }

  const approved = (opts.waTemplates || []).filter((tpl) => {
    if (!isApprovedMeta(tpl)) return false;
    const metaName = templateMetaName(tpl);
    if (isTestTemplateName(metaName)) return false;
    if (
      isLegacyManagedMetaTemplateName(metaName) &&
      preferredMetaName !== "new_lead_received" &&
      preferredMetaName !== "new_lead_received_utility" &&
      opts.allowBusinessAlert !== true
    ) {
      return false;
    }
    return true;
  });

  const exact = approved.find(
    (tpl) => templateMetaName(tpl) === preferredMetaName
  );
  if (!exact) {
    return {
      ...base,
      whyNotReady: WA_TEMPLATE_UNAVAILABLE_HE,
    };
  }

  const metaName = templateMetaName(exact);
  const mappings =
    WA_DEFAULT_META_MAPPINGS[metaName]?.map((m) => ({ ...m, required: true })) ||
    defaultMappingsForMetaTemplate(metaName);

  return {
    automationTemplateKey,
    preferredMetaName,
    metaTemplate: exact,
    metaTemplateName: metaName,
    metaStatus: "APPROVED",
    metaCategory: String(
      (exact as WhatsAppTemplate).metaCategory ||
        (exact as ApprovedWhatsAppTemplate).category ||
        exact.category ||
        ""
    ),
    language: String((exact as WhatsAppTemplate).language || ""),
    variableCount: countBodyVariables(exact) || mappings.length,
    variableMappings: mappings,
    recipientType: recipientTypeForMeta(metaName),
    ready: true,
    whyNotReady: null,
  };
}

export function listAutomationKeysNeedingMetaTemplate(
  keys: string[]
): Array<{ automationTemplateKey: string; preferredMetaName: string }> {
  return keys
    .map((automationTemplateKey) => ({
      automationTemplateKey,
      preferredMetaName: BLUEPRINT_PREFERRED_META[automationTemplateKey] || "",
    }))
    .filter((row) => Boolean(row.preferredMetaName));
}