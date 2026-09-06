import i18n from "../i18n/i18n";
import API from "../api";

export type AiResultCategory = "leads" | "drafts" | "digests" | "tasks" | "other";

export type AiAutomationResult = {
  _id: string;
  businessId: string;
  templateKey: string;
  actionKey: string;
  resultCategory: AiResultCategory;
  resultType: string;
  title: string;
  preview: string;
  summary?: string;
  structured?: Record<string, unknown>;
  status: "completed" | "failed";
  workflowId?: string | null;
  executionId?: string;
  leadId?: string | null;
  leadName?: string;
  taskId?: string | null;
  activityId?: string | null;
  notificationId?: string | null;
  targetUrl?: string;
  generatedAt?: string;
  dateRange?: { from?: string | null; to?: string | null };
  createdAt?: string;
  updatedAt?: string;
};

function withBusiness(businessId: string) {
  return { params: { businessId } };
}

export async function listAiAutomationResults(
  businessId: string,
  opts: {
    filter?: string;
    q?: string;
    templateKey?: string;
    leadId?: string;
    limit?: number;
    skip?: number;
  } = {}
): Promise<{ items: AiAutomationResult[]; total: number }> {
  const { data } = await API.get("/automations/ai-results", {
    ...withBusiness(businessId),
    params: {
      businessId,
      filter: opts.filter || "all",
      q: opts.q || "",
      templateKey: opts.templateKey || undefined,
      leadId: opts.leadId || undefined,
      limit: opts.limit ?? 40,
      skip: opts.skip ?? 0,
    },
  });
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: Number(data?.total || 0),
  };
}

export async function getAiAutomationResult(
  businessId: string,
  resultId: string
): Promise<AiAutomationResult | null> {
  const { data } = await API.get(`/automations/ai-results/${resultId}`, {
    ...withBusiness(businessId),
    params: { businessId },
  });
  return data?.item || null;
}

const AI_TEMPLATE_FALLBACK: Record<string, string> = {
  ai_lead_scoring: "Automatic lead scoring",
  ai_lead_classify: "Automatic lead classification",
  ai_lead_auto_tag: "Automatic lead tagging",
  ai_hot_lead: "Hot lead detection",
  ai_lead_brief: "Lead brief before a sales call",
  ai_followup_draft: "Follow-up draft",
  ai_email_draft: "Email draft",
  ai_next_action: "Next-action suggestion",
  ai_daily_leads_digest: "Daily leads digest",
  ai_daily_agenda_digest: "Daily tasks / meetings digest",
};

export function getAiTemplateLabel(templateKey: string) {
  return i18n.t(`leftover.aiTemplate.${templateKey}`, {
    defaultValue: AI_TEMPLATE_FALLBACK[templateKey] || templateKey,
  });
}

export const AI_TEMPLATE_LABELS: Record<string, string> = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return getAiTemplateLabel(prop);
    },
  }
);
