import type { TFunction } from "i18next";
import i18n from "../../../../i18n/i18n";
import type { AutomationNodeType } from "../../../../api/automationWorkflowApi";

export type { AutomationNodeType };

type TranslateFn = TFunction;

export type PaletteFilter =
  | "all"
  | "trigger"
  | "condition"
  | "router"
  | "delay"
  | "action";

export type PaletteItem = {
  type: AutomationNodeType;
  key: string;
  label: string;
  description: string;
  color: string;
  defaults: Record<string, unknown>;
  group: "triggers" | "flow" | "actions";
  filter: Exclude<PaletteFilter, "all">;
  supported?: boolean;
  comingSoon?: boolean;
};

export type AutomationTriggerConfigField = {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  options?: Array<{ value: string | number; label: string }>;
};

export type AutomationTriggerOption = {
  key: string;
  label: string;
  description?: string;
  category?: string;
  status?: string;
  isSupported: boolean;
  isPublishable: boolean;
  icon?: string | null;
  keywords?: string[];
  configSchema?: AutomationTriggerConfigField[];
  billingNote?: string;
  triggerBillable?: boolean;
  requiredConnection?: string | null;
  comingSoon?: boolean;
};

export function getTriggerCategoryLabels(
  t: TranslateFn = i18n.t.bind(i18n)
): Record<string, string> {
  return {
    crm: t("automations.catalog.triggerCategories.crm"),
    appointments: t("automations.catalog.triggerCategories.appointments"),
    website: t("automations.catalog.triggerCategories.website"),
    store: t("automations.catalog.triggerCategories.store"),
    schedule: t("automations.catalog.triggerCategories.schedule"),
    manual: t("automations.catalog.triggerCategories.manual"),
    system: t("automations.catalog.triggerCategories.system"),
    whatsapp: t("automations.catalog.triggerCategories.whatsapp"),
    subscriptions: t("automations.catalog.triggerCategories.subscriptions"),
    tasks: t("automations.catalog.triggerCategories.tasks"),
    email: t("automations.catalog.triggerCategories.email"),
  };
}

export const TRIGGER_CATEGORY_LABELS: Record<string, string> =
  getTriggerCategoryLabels();

export function triggerOptionFromCatalog(row: {
  key: string;
  label: string;
  description?: string;
  category?: string;
  status?: string;
  isSupported?: boolean;
  isPublishable?: boolean;
  icon?: string | null;
  keywords?: string[];
  configSchema?: AutomationTriggerConfigField[];
  billingSemantics?: { triggerBillable?: boolean; note?: string };
  requiredConnection?: string | null;
}): AutomationTriggerOption | null {
  const isSupported = Boolean(row.isSupported);
  const isPublishable = Boolean(row.isPublishable);
  // Customer UI: never surface unsupported / coming-soon triggers.
  if (!isSupported || !isPublishable) return null;
  return {
    key: String(row.key),
    label: String(row.label || row.key),
    description: String(row.description || ""),
    category: String(row.category || "crm"),
    status: String(row.status || "active"),
    isSupported,
    isPublishable,
    icon: row.icon || null,
    keywords: Array.isArray(row.keywords)
      ? row.keywords.map((value) => String(value))
      : [],
    configSchema: Array.isArray(row.configSchema) ? row.configSchema : [],
    billingNote:
      row.billingSemantics?.note ||
      i18n.t("automations.catalog.noCharge"),
    triggerBillable: Boolean(row.billingSemantics?.triggerBillable),
    requiredConnection: row.requiredConnection || null,
    comingSoon: false,
  };
}

export type ActionOption = {
  value: string;
  label: string;
  supported: boolean;
  comingSoon?: boolean;
  /** Shown as a new choice in the picker / inspector. */
  customerVisible?: boolean;
  /** Duplicate UI key; kept for label lookup of existing graphs. */
  aliasOf?: string;
};

const ACTION_OPTION_DEFS: Array<Omit<ActionOption, "label">> = [
  { value: "create_task", supported: true },
  { value: "update_lead_status", supported: true },
  {
    value: "update_status",
    supported: true,
    customerVisible: false,
    aliasOf: "update_lead_status",
  },
  { value: "assign_owner", supported: true },
  { value: "add_tag", supported: true },
  { value: "create_crm_note", supported: true },
  { value: "whatsapp_template", supported: true },
  {
    value: "send_whatsapp",
    supported: true,
    customerVisible: false,
    aliasOf: "whatsapp_template",
  },
  { value: "send_email", supported: true },
  { value: "send_gmail", supported: true },
  { value: "send_outlook", supported: true },
  { value: "google_calendar_create_event", supported: true },
  { value: "google_calendar_update_event", supported: true },
  { value: "google_calendar_delete_event", supported: true },
  { value: "notify", supported: true },
  {
    value: "internal_notification",
    supported: true,
    customerVisible: false,
    aliasOf: "notify",
  },
  { value: "delay", supported: true, customerVisible: false },
  { value: "webhook", supported: true },
  { value: "stop", supported: true },
  {
    value: "create_appointment",
    supported: false,
    comingSoon: false,
    customerVisible: false,
  },
  { value: "ai_rank_lead", supported: true, comingSoon: false },
  { value: "ai_classify_lead", supported: true, comingSoon: false },
  { value: "ai_auto_tag", supported: true, comingSoon: false },
  { value: "ai_detect_hot_lead", supported: true, comingSoon: false },
  { value: "ai_lead_brief", supported: true, comingSoon: false },
  { value: "ai_draft_followup", supported: true, comingSoon: false },
  { value: "ai_draft_email", supported: true, comingSoon: false },
  { value: "ai_suggest_next_action", supported: true, comingSoon: false },
  { value: "ai_daily_leads_digest", supported: true, comingSoon: false },
  { value: "ai_daily_agenda_digest", supported: true, comingSoon: false },
];

export function getActionOptions(
  t: TranslateFn = i18n.t.bind(i18n)
): ActionOption[] {
  return ACTION_OPTION_DEFS.map((row) => ({
    ...row,
    label: t(`automations.catalog.actions.${row.value}`),
  }));
}

export const ACTION_OPTIONS: ActionOption[] = getActionOptions();

export function isCustomerFacingAction(option: ActionOption): boolean {
  if (option.aliasOf) return false;
  if (option.customerVisible === false) return false;
  if (option.supported !== true) return false;
  if (option.comingSoon) return false;
  return true;
}

export function listCustomerActionOptions(
  t: TranslateFn = i18n.t.bind(i18n)
): ActionOption[] {
  return getActionOptions(t).filter(isCustomerFacingAction);
}

export function findActionOption(
  key: string,
  t: TranslateFn = i18n.t.bind(i18n)
): ActionOption | undefined {
  return getActionOptions(t).find((entry) => entry.value === String(key || ""));
}

/** Inspector choices: unique supported actions, plus the current key if a legacy graph still uses it. */
export function listInspectorActionOptions(
  currentKey?: string,
  t: TranslateFn = i18n.t.bind(i18n)
): ActionOption[] {
  const visible = listCustomerActionOptions(t);
  const current = String(currentKey || "").trim();
  if (!current || visible.some((entry) => entry.value === current)) {
    return visible;
  }
  const existing = findActionOption(current, t);
  if (!existing) {
    return [
      { value: current, label: current, supported: true, customerVisible: false },
      ...visible,
    ];
  }
  return [existing, ...visible];
}

const CONDITION_VALUES = [
  "no_response",
  "status_is",
  "has_appointment",
  "has_tag",
  "source_is",
  "business_hours",
  "replied",
  "amount_above",
] as const;

export function getConditionOptions(t: TranslateFn = i18n.t.bind(i18n)) {
  return CONDITION_VALUES.map((value) => ({
    value,
    label: t(`automations.catalog.conditions.${value}`),
  }));
}

export const CONDITION_OPTIONS = getConditionOptions();

export function getDelayUnits(t: TranslateFn = i18n.t.bind(i18n)) {
  return (["minutes", "hours", "days"] as const).map((value) => ({
    value,
    label: t(`automations.catalog.delayUnits.${value}`),
  }));
}

export const DELAY_UNITS = getDelayUnits();

export function getFilterChips(
  t: TranslateFn = i18n.t.bind(i18n)
): Array<{ key: PaletteFilter; label: string }> {
  return [
    { key: "all", label: t("automations.catalog.filters.all") },
    { key: "trigger", label: t("automations.catalog.filters.trigger") },
    { key: "condition", label: t("automations.catalog.filters.condition") },
    { key: "router", label: t("automations.catalog.filters.router") },
    { key: "delay", label: t("automations.catalog.filters.delay") },
    { key: "action", label: t("automations.catalog.filters.action") },
  ];
}

export const FILTER_CHIPS: Array<{ key: PaletteFilter; label: string }> =
  getFilterChips();

function triggerItem(
  key: string,
  label: string,
  description: string,
  routeCount = 1,
  supported = true,
  extras?: {
    icon?: string | null;
    keywords?: string[];
    billingNote?: string;
  },
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem {
  const defaults: Record<string, unknown> = {
    label,
    triggerKey: key,
    routeCount,
  };
  // Reminder trigger → result timing lives on the trigger node.
  if (key === "appointment_reminder" || key.includes("appointment_reminder")) {
    defaults.hoursBefore = 24;
    defaults.label = label || t("automations.catalog.palette.reminderDefault");
  }
  if (key === "lead_status_changed") {
    defaults.toStatus = "contacted";
    defaults.fromStatus = "";
  }
  if (key === "scheduled") {
    // Schedule defaults are applied by the editor when selected.
  }
  return {
    type: "trigger",
    key,
    group: "triggers",
    filter: "trigger",
    label,
    description:
      key === "appointment_reminder"
        ? t("automations.catalog.palette.reminderDesc")
        : description,
    color: "#7c3aed",
    defaults: {
      ...defaults,
      icon: extras?.icon || null,
      billingNote: extras?.billingNote || t("automations.catalog.noCharge"),
    },
    supported,
    comingSoon: !supported,
  };
}

function actionItem(
  key: string,
  label: string,
  description: string,
  supported = true,
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem {
  const defaults: Record<string, unknown> = { label, actionKey: key, templateId: "" };
  if (key.startsWith("ai_")) { Object.assign(defaults, { criteria: t("automations.catalog.palette.aiCriteriaDefault"), scoreMin: 1, scoreMax: 10, threshold: 7, createTask: true, extraInstructions: "" }); }
  if (key === "send_gmail" || key === "send_outlook" || key === "send_email") {
    defaults.recipientType = "lead_email";
    defaults.subject = "";
    defaults.html = "";
    defaults.body = "";
    defaults.text = "";
    if (key === "send_gmail" || key === "send_outlook") {
      defaults.emailProvider = key === "send_outlook" ? "microsoft" : "gmail";
    }
  }
  if (key === "google_calendar_create_event") {
    defaults.title = t("automations.catalog.palette.meetingTitleDefault");
    defaults.description = "";
    defaults.manualEventDetails = false;
    defaults.start = "";
    defaults.end = "";
    defaults.durationMinutes = "";
    defaults.attendeeEmail = "";
    defaults.location = "";
    defaults.calendarId = "primary";
  }
  if (key === "google_calendar_update_event") {
    defaults.eventId = "{{appointment.googleEventId}}";
    defaults.title = t("automations.catalog.palette.meetingTitleDefault");
    defaults.calendarId = "primary";
    defaults.durationMinutes = 60;
  }
  if (key === "google_calendar_delete_event") {
    defaults.eventId = "{{appointment.googleEventId}}";
    defaults.calendarId = "primary";
  }
  return {
    type: "action",
    key,
    group: "actions",
    filter: "action",
    label: t("automations.catalog.palette.resultPrefix", { label }),
    description,
    color: "#059669",
    defaults,
    supported,
    comingSoon: !supported,
  };
}

function conditionItem(
  key: string,
  label: string,
  description: string,
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem {
  return {
    type: "condition",
    key,
    group: "flow",
    filter: "condition",
    label: t("automations.catalog.palette.conditionPrefix", { label }),
    description,
    color: "#d97706",
    defaults: { label, conditionKey: key },
  };
}

/** Flow + action modules only. Triggers are loaded from the server catalog. */
function buildRawFlowActionPalette(
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem[] {
  return [
    {
      type: "router",
      key: "router",
      group: "flow",
      filter: "router",
      label: t("automations.catalog.palette.routerLabel"),
      description: t("automations.catalog.palette.routerDesc"),
      color: "#db2777",
      defaults: {
        label: t("automations.catalog.palette.routerDefault"),
        pathCount: 1,
        paths: [{ id: "path_1", label: t("automations.catalog.palette.resultN", { n: 1 }) }],
      },
    },
    conditionItem(
      "no_response",
      t("automations.catalog.conditions.no_response"),
      t("automations.catalog.conditionDesc.no_response"),
      t
    ),
    conditionItem(
      "status_is",
      t("automations.catalog.conditions.status_is"),
      t("automations.catalog.conditionDesc.status_is"),
      t
    ),
    conditionItem(
      "has_appointment",
      t("automations.catalog.conditionHasAppointmentShort"),
      t("automations.catalog.conditionDesc.has_appointment"),
      t
    ),
    conditionItem(
      "has_tag",
      t("automations.catalog.conditions.has_tag"),
      t("automations.catalog.conditionDesc.has_tag"),
      t
    ),
    conditionItem(
      "source_is",
      t("automations.catalog.conditionSourceShort"),
      t("automations.catalog.conditionDesc.source_is"),
      t
    ),
    conditionItem(
      "business_hours",
      t("automations.catalog.conditions.business_hours"),
      t("automations.catalog.conditionDesc.business_hours"),
      t
    ),
    conditionItem(
      "replied",
      t("automations.catalog.conditions.replied"),
      t("automations.catalog.conditionDesc.replied"),
      t
    ),
    conditionItem(
      "amount_above",
      t("automations.catalog.conditions.amount_above"),
      t("automations.catalog.conditionDesc.amount_above"),
      t
    ),
    {
      type: "delay",
      key: "wait",
      group: "flow",
      filter: "delay",
      label: t("automations.catalog.palette.waitLabel"),
      description: t("automations.catalog.palette.waitDesc"),
      color: "#0891b2",
      defaults: {
        label: t("automations.catalog.palette.waitLabel"),
        amount: 10,
        unit: "minutes",
      },
    },
    actionItem(
      "whatsapp_template",
      t("automations.catalog.actionShort.whatsapp_template"),
      t("automations.catalog.actionDesc.whatsapp_template"),
      true,
      t
    ),
    actionItem(
      "create_task",
      t("automations.catalog.actionShort.create_task"),
      t("automations.catalog.actionDesc.create_task"),
      true,
      t
    ),
    actionItem(
      "create_crm_note",
      t("automations.catalog.actionShort.create_crm_note"),
      t("automations.catalog.actionDesc.create_crm_note"),
      true,
      t
    ),
    actionItem(
      "notify",
      t("automations.catalog.actionShort.notify"),
      t("automations.catalog.actionDesc.notify"),
      true,
      t
    ),
    actionItem(
      "update_lead_status",
      t("automations.catalog.actionShort.update_lead_status"),
      t("automations.catalog.actionDesc.update_lead_status"),
      true,
      t
    ),
    actionItem(
      "assign_owner",
      t("automations.catalog.actionShort.assign_owner"),
      t("automations.catalog.actionDesc.assign_owner"),
      true,
      t
    ),
    actionItem(
      "add_tag",
      t("automations.catalog.actionShort.add_tag"),
      t("automations.catalog.actionDesc.add_tag"),
      true,
      t
    ),
    actionItem(
      "send_gmail",
      t("automations.catalog.actionShort.send_gmail"),
      t("automations.catalog.actionDesc.send_gmail"),
      true,
      t
    ),
    actionItem(
      "send_outlook",
      t("automations.catalog.actionShort.send_outlook"),
      t("automations.catalog.actionDesc.send_outlook"),
      true,
      t
    ),
    actionItem(
      "send_email",
      t("automations.catalog.actionShort.send_email"),
      t("automations.catalog.actionDesc.send_email"),
      true,
      t
    ),
    actionItem(
      "google_calendar_create_event",
      t("automations.catalog.actionShort.google_calendar_create_event"),
      t("automations.catalog.actionDesc.google_calendar_create_event"),
      true,
      t
    ),
    actionItem(
      "google_calendar_update_event",
      t("automations.catalog.actionShort.google_calendar_update_event"),
      t("automations.catalog.actionDesc.google_calendar_update_event"),
      true,
      t
    ),
    actionItem(
      "google_calendar_delete_event",
      t("automations.catalog.actionShort.google_calendar_delete_event"),
      t("automations.catalog.actionDesc.google_calendar_delete_event"),
      true,
      t
    ),
    actionItem(
      "webhook",
      t("automations.catalog.actionShort.webhook"),
      t("automations.catalog.actionDesc.webhook"),
      true,
      t
    ),
    actionItem(
      "ai_rank_lead",
      t("automations.catalog.actionShort.ai_rank_lead"),
      t("automations.catalog.actionDesc.ai_rank_lead"),
      true,
      t
    ),
    actionItem(
      "ai_classify_lead",
      t("automations.catalog.actionShort.ai_classify_lead"),
      t("automations.catalog.actionDesc.ai_classify_lead"),
      true,
      t
    ),
    actionItem(
      "ai_auto_tag",
      t("automations.catalog.actionShort.ai_auto_tag"),
      t("automations.catalog.actionDesc.ai_auto_tag"),
      true,
      t
    ),
    actionItem(
      "ai_detect_hot_lead",
      t("automations.catalog.actionShort.ai_detect_hot_lead"),
      t("automations.catalog.actionDesc.ai_detect_hot_lead"),
      true,
      t
    ),
    actionItem(
      "ai_lead_brief",
      t("automations.catalog.actionShort.ai_lead_brief"),
      t("automations.catalog.actionDesc.ai_lead_brief"),
      true,
      t
    ),
    actionItem(
      "ai_draft_followup",
      t("automations.catalog.actionShort.ai_draft_followup"),
      t("automations.catalog.actionDesc.ai_draft_followup"),
      true,
      t
    ),
    actionItem(
      "ai_draft_email",
      t("automations.catalog.actionShort.ai_draft_email"),
      t("automations.catalog.actionDesc.ai_draft_email"),
      true,
      t
    ),
    actionItem(
      "ai_suggest_next_action",
      t("automations.catalog.actionShort.ai_suggest_next_action"),
      t("automations.catalog.actionDesc.ai_suggest_next_action"),
      true,
      t
    ),
    actionItem(
      "ai_daily_leads_digest",
      t("automations.catalog.actionShort.ai_daily_leads_digest"),
      t("automations.catalog.actionDesc.ai_daily_leads_digest"),
      true,
      t
    ),
    actionItem(
      "ai_daily_agenda_digest",
      t("automations.catalog.actionShort.ai_daily_agenda_digest"),
      t("automations.catalog.actionDesc.ai_daily_agenda_digest"),
      true,
      t
    ),
  ];
}

function applyActionSupport(item: PaletteItem): PaletteItem {
  if (item.type !== "action") {
    return {
      ...item,
      supported: item.supported !== false,
      comingSoon: false,
    };
  }
  const option = findActionOption(item.key);
  const supported = option ? option.supported === true : item.supported !== false;
  return { ...item, supported, comingSoon: false };
}

function isCustomerFacingPaletteItem(item: PaletteItem): boolean {
  if (item.type !== "action") return true;
  const option = findActionOption(item.key);
  if (!option) return item.supported !== false;
  return isCustomerFacingAction(option);
}

export function getFlowActionPalette(
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem[] {
  return buildRawFlowActionPalette(t)
    .map(applyActionSupport)
    .filter(isCustomerFacingPaletteItem);
}

export const FLOW_ACTION_PALETTE: PaletteItem[] = getFlowActionPalette();

/** Non-trigger palette (flow/actions). Use buildPaletteWithTriggers for full list. */
export const PALETTE: PaletteItem[] = FLOW_ACTION_PALETTE;

/** New manual trigger/router fan-out. Saved and template values are never coerced. */
export const DEFAULT_NEW_TRIGGER_ROUTE_COUNT = 1;

export function buildTriggerPaletteItems(
  triggers: AutomationTriggerOption[],
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem[] {
  return triggers
    .filter((trigger) => trigger.isSupported && trigger.isPublishable)
    .map((trigger) =>
      triggerItem(
        trigger.key,
        trigger.label,
        trigger.description || "",
        DEFAULT_NEW_TRIGGER_ROUTE_COUNT,
        true,
        {
          icon: trigger.icon,
          keywords: trigger.keywords,
          billingNote: trigger.billingNote,
        },
        t
      )
    );
}

export function buildPaletteWithTriggers(
  triggers: AutomationTriggerOption[],
  t: TranslateFn = i18n.t.bind(i18n)
): PaletteItem[] {
  return [
    ...buildTriggerPaletteItems(triggers, t),
    ...getFlowActionPalette(t),
  ];
}

export function findTriggerOption(
  triggers: AutomationTriggerOption[],
  key: string
): AutomationTriggerOption | undefined {
  return triggers.find((row) => row.key === String(key || ""));
}

export function getTypeMeta(
  t: TranslateFn = i18n.t.bind(i18n)
): Record<AutomationNodeType, { title: string; color: string; accent: string }> {
  return {
    trigger: {
      title: t("automations.catalog.nodeTypes.trigger"),
      color: "#7c3aed",
      accent: "#ede9fe",
    },
    delay: {
      title: t("automations.catalog.nodeTypes.delay"),
      color: "#0891b2",
      accent: "#cffafe",
    },
    condition: {
      title: t("automations.catalog.nodeTypes.condition"),
      color: "#d97706",
      accent: "#fef3c7",
    },
    action: {
      title: t("automations.catalog.nodeTypes.action"),
      color: "#059669",
      accent: "#d1fae5",
    },
    router: {
      title: t("automations.catalog.nodeTypes.router"),
      color: "#db2777",
      accent: "#fce7f3",
    },
  };
}

export const TYPE_META: Record<
  AutomationNodeType,
  { title: string; color: string; accent: string }
> = getTypeMeta();

export const QUICK_ADD_AFTER: PaletteItem[] = [
  PALETTE.find((p) => p.key === "router")!,
  PALETTE.find((p) => p.key === "no_response")!,
  PALETTE.find((p) => p.key === "wait")!,
  PALETTE.find((p) => p.key === "whatsapp_template")!,
  PALETTE.find((p) => p.key === "create_task")!,
  PALETTE.find((p) => p.key === "notify")!,
].filter(Boolean);

export function clampRouteCount(value: unknown, fallback = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(6, Math.max(1, Math.round(n)));
}

export function ensureRouterPaths(
  data: Record<string, unknown>,
  t: TranslateFn = i18n.t.bind(i18n)
) {
  const pathCount = Math.max(1, clampRouteCount(data.pathCount, 1));
  const existing = Array.isArray(data.paths)
    ? (data.paths as Array<{ id?: string; label?: string }>)
    : [];
  const paths = Array.from({ length: pathCount }, (_, index) => {
    const prev = existing[index];
    return {
      id: prev?.id || `path_${index + 1}`,
      label: prev?.label || t("automations.catalog.palette.resultN", { n: index + 1 }),
    };
  });
  return { pathCount, paths };
}

export function nodeSummary(
  data: Record<string, unknown>,
  type: AutomationNodeType,
  t: TranslateFn = i18n.t.bind(i18n)
) {
  if (type === "delay") {
    const amount = Number(data.amount) || 0;
    const unit = String(data.unit || "minutes");
    const unitLabel =
      getDelayUnits(t).find((u) => u.value === unit)?.label || unit;
    return `${amount} ${unitLabel}`;
  }
  if (type === "trigger") {
    const key = String(data.triggerKey || "");
    if (key === "appointment_reminder") {
      const hours = Number(data.hoursBefore) || 24;
      if (hours === 1) return t("automations.catalog.summaries.hourBefore");
      if (hours === 2) return t("automations.catalog.summaries.twoHoursBefore");
      if (hours === 24) return t("automations.catalog.summaries.dayBefore");
      if (hours % 24 === 0) {
        return t("automations.catalog.summaries.daysBefore", { count: hours / 24 });
      }
      return t("automations.catalog.summaries.hoursBefore", { count: hours });
    }
    if (key === "lead_status_changed") {
      const toStatus = String(data.toStatus || "").trim();
      const fromStatus = String(data.fromStatus || "").trim();
      if (fromStatus && toStatus) {
        return t("automations.catalog.summaries.statusFromTo", {
          from: fromStatus,
          to: toStatus,
        });
      }
      if (toStatus) {
        return t("automations.catalog.summaries.statusTo", { status: toStatus });
      }
      return t("automations.catalog.summaries.anyStatusChange");
    }
    if (key === "scheduled") {
      return t("automations.catalog.summaries.bySchedule");
    }
    if (key === "manual") return t("automations.catalog.summaries.manual");
    if (key === "new_lead") return t("automations.catalog.summaries.newLead");
    if (key === "form_submitted") return t("automations.catalog.summaries.formSubmitted");
    if (key === "appointment_created") {
      return t("automations.catalog.summaries.appointmentCreated");
    }
    if (key === "appointment_cancelled") {
      return t("automations.catalog.summaries.appointmentCancelled");
    }
    if (key === "order_created") return t("automations.catalog.summaries.orderCreated");
    if (key === "store_order_paid" || key === "payment_succeeded") {
      return t("automations.catalog.summaries.orderPaid");
    }
    return String(data.label || t("automations.catalog.summaries.triggerFallback"));
  }
  if (type === "condition") {
    const key = String(data.conditionKey || "");
    return (
      getConditionOptions(t).find((o) => o.value === key)?.label ||
      String(data.label || "")
    );
  }
  if (type === "router") {
    const { pathCount } = ensureRouterPaths(data, t);
    return t("automations.catalog.summaries.routerTogether", { count: pathCount });
  }
  if (type === "action") {
    const key = String(data.actionKey || "");
    if (key.startsWith("ai_")) {
      const summaryKey = `automations.catalog.summaries.${key}`;
      const translated = t(summaryKey);
      return translated === summaryKey
        ? t("automations.catalog.summaries.aiFallback")
        : translated;
    }
    if (key === "send_gmail" || key === "send_outlook") {
      const providerLabel = key === "send_outlook" ? "Outlook" : "Gmail";
      const sender =
        String(data.senderEmail || providerLabel).trim() || providerLabel;
      const recipientType = String(data.recipientType || "lead_email");
      const recipient =
        t(`automations.catalog.recipients.${recipientType}`) ||
        t("automations.catalog.recipients.lead_email");
      return `${providerLabel} · ${sender} → ${recipient}`;
    }
    if (
      key === "google_calendar_create_event" ||
      key === "google_calendar_update_event" ||
      key === "google_calendar_delete_event"
    ) {
      const title = String(data.title || data.summary || "").trim();
      if (key === "google_calendar_delete_event") {
        return t("automations.catalog.summaries.calendarDelete", {
          eventId: String(data.eventId || "").trim(),
        }).trim();
      }
      return title
        ? `Calendar · ${title}`
        : getActionOptions(t).find((o) => o.value === key)?.label ||
            "Google Calendar";
    }
    return (
      getActionOptions(t).find((o) => o.value === key)?.label ||
      String(data.label || "")
    );
  }
  return String(data.label || "");
}

export function defaultSourceHandle(
  type: AutomationNodeType,
  _data: Record<string, unknown>
) {
  void _data;
  if (type === "trigger") return "route_1";
  if (type === "router") return "path_1";
  if (type === "condition") return "yes";
  return "out";
}

export function listSourceHandles(
  type: AutomationNodeType,
  data: Record<string, unknown>
): string[] {
  if (type === "trigger") {
    const count = clampRouteCount(data.routeCount, 1);
    return Array.from({ length: count }, (_, i) => `route_${i + 1}`);
  }
  if (type === "router") {
    const { pathCount } = ensureRouterPaths(data);
    return Array.from({ length: pathCount }, (_, i) => `path_${i + 1}`);
  }
  if (type === "condition") return ["yes", "no"];
  return ["out"];
}
