import {
  BOTTLENECK_OPTIONS,
  DEMO_FOCUS_OPTIONS,
  emptyIntroQuestionnaire,
  emptySelectionBlock,
  IntroQuestionnaire,
  LEAD_SOURCE_OPTIONS,
  MARKETING_ANSWER_OPTIONS,
  MARKETING_CHANNEL_OPTIONS,
  MISSING_NEEDS_OPTIONS,
  SelectionBlock,
  TEAM_HANDLER_OPTIONS,
  WEBSITE_IMPROVEMENT_OPTIONS,
  WEBSITE_STATUS_OPTIONS,
} from "./types";

type Option = { value: string; label: string };

function labelsFor(values: string[], options: readonly Option[]) {
  const map = Object.fromEntries(options.map((o) => [o.value, o.label]));
  return values
    .filter((v) => v !== "other")
    .map((v) => map[v] || v)
    .filter(Boolean);
}

function joinLabels(values: string[], options: readonly Option[], other = "") {
  const parts = labelsFor(values, options);
  if (values.includes("other") && other.trim()) parts.push(other.trim());
  return parts.join(" + ");
}

export function introQuestionnaireFromCallSummary(callSummary: any): IntroQuestionnaire {
  const base = emptyIntroQuestionnaire();
  const raw = callSummary?.introQuestionnaire;
  if (!raw || typeof raw !== "object") return base;

  const mergeBlock = (block: any): SelectionBlock => ({
    selections: Array.isArray(block?.selections) ? block.selections : [],
    other: String(block?.other || ""),
    note: String(block?.note || ""),
    detail: String(block?.detail || ""),
  });

  return {
    ...base,
    ...raw,
    missingNeeds: mergeBlock(raw.missingNeeds),
    marketing: {
      answer: String(raw.marketing?.answer || ""),
      other: String(raw.marketing?.other || ""),
      channels: mergeBlock(raw.marketing?.channels),
    },
    leadSources: mergeBlock(raw.leadSources),
    bottlenecks: mergeBlock(raw.bottlenecks),
    website: {
      status: String(raw.website?.status || ""),
      other: String(raw.website?.other || ""),
      satisfaction: String(raw.website?.satisfaction || ""),
      improvements: mergeBlock(raw.website?.improvements),
      note: String(raw.website?.note || ""),
    },
    team: {
      handler: String(raw.team?.handler || ""),
      other: String(raw.team?.other || ""),
      userCount: String(raw.team?.userCount || ""),
    },
    demoFocus: mergeBlock(raw.demoFocus),
  };
}

export function hasIntroSummaryData(questionnaire: IntroQuestionnaire) {
  return JSON.stringify(questionnaire) !== JSON.stringify(emptyIntroQuestionnaire());
}

export function suggestDemoFocus(questionnaire: IntroQuestionnaire): string[] {
  const suggested = new Set<string>();
  const add = (...keys: string[]) => keys.forEach((k) => suggested.add(k));

  for (const value of questionnaire.missingNeeds.selections) {
    if (value === "crm" || value === "lead_order" || value === "customer_tracking") add("crm", "leads");
    if (value === "whatsapp") add("whatsapp");
    if (value === "automations") add("automations");
    if (value === "scheduling") add("scheduling");
    if (value === "tasks") add("tasks");
    if (value === "team") add("team");
    if (value === "website" || value === "online_store") add("website");
    if (value === "centralization") add("full_system");
  }

  for (const value of questionnaire.bottlenecks.selections) {
    if (["lost_leads", "unclear_status", "no_quote_tracking", "no_sales_process"].includes(value)) {
      add("crm", "leads");
    }
    if (["forgot_followup", "no_automations"].includes(value)) add("automations");
    if (value === "no_centralization") add("full_system");
  }

  if (questionnaire.demoFocus.selections.length) {
    questionnaire.demoFocus.selections.forEach((v) => suggested.add(v));
  }

  return [...suggested].slice(0, 6);
}

export type SummaryPreviewLine = { label: string; value: string };

export function buildSummaryPreview(questionnaire: IntroQuestionnaire): SummaryPreviewLine[] {
  const lines: SummaryPreviewLine[] = [];

  if (questionnaire.businessDescription.trim()) {
    lines.push({ label: "העסק", value: questionnaire.businessDescription.trim() });
  }

  const needs = joinLabels(
    questionnaire.missingNeeds.selections,
    MISSING_NEEDS_OPTIONS,
    questionnaire.missingNeeds.other
  );
  if (needs) lines.push({ label: "צורך מרכזי", value: needs });

  if (questionnaire.currentManagement.trim()) {
    lines.push({ label: "מערכת נוכחית", value: questionnaire.currentManagement.trim() });
  }

  const sources = joinLabels(
    questionnaire.leadSources.selections,
    LEAD_SOURCE_OPTIONS,
    questionnaire.leadSources.other
  );
  if (sources) lines.push({ label: "מקור לידים עיקרי", value: sources });

  const demo = joinLabels(
    questionnaire.demoFocus.selections.length
      ? questionnaire.demoFocus.selections
      : suggestDemoFocus(questionnaire),
    DEMO_FOCUS_OPTIONS,
    questionnaire.demoFocus.other
  );
  if (demo) lines.push({ label: "דמו מומלץ", value: demo });

  if (questionnaire.workingGaps.trim()) {
    lines.push({ label: "מה חסר היום", value: questionnaire.workingGaps.trim() });
  }

  const marketingAnswer = MARKETING_ANSWER_OPTIONS.find((o) => o.value === questionnaire.marketing.answer)?.label;
  if (marketingAnswer) {
    const channels = joinLabels(
      questionnaire.marketing.channels.selections,
      MARKETING_CHANNEL_OPTIONS,
      questionnaire.marketing.channels.other
    );
    lines.push({
      label: "שיווק",
      value: channels ? `${marketingAnswer} · ${channels}` : marketingAnswer,
    });
  }

  const bottlenecks = joinLabels(
    questionnaire.bottlenecks.selections,
    BOTTLENECK_OPTIONS,
    questionnaire.bottlenecks.other
  );
  if (bottlenecks) lines.push({ label: "תקיעות בתהליך", value: bottlenecks });

  if (questionnaire.oneThingTomorrow.trim()) {
    lines.push({ label: "דבר אחד למחר", value: questionnaire.oneThingTomorrow.trim() });
  }

  return lines.slice(0, 6);
}

export function optionLabel(value: string, options: readonly Option[]) {
  return options.find((o) => o.value === value)?.label || value;
}

export function websiteStatusLabel(status: string) {
  return optionLabel(status, WEBSITE_STATUS_OPTIONS);
}

export function teamHandlerLabel(handler: string) {
  return optionLabel(handler, TEAM_HANDLER_OPTIONS);
}

export function websiteImprovementLabels(values: string[], other = "") {
  return joinLabels(values, WEBSITE_IMPROVEMENT_OPTIONS, other);
}

export { emptySelectionBlock };
