/**
 * Client mirror of server automationActionPolicy (0|1 action billing).
 * Billing unit = billable automation ACTION, not workflow execution.
 */

const BILLABLE_ACTION_KEYS = new Set([
  "create_task",
  "update_lead_status",
  "assign_owner",
  "add_tag",
  "create_crm_note",
  "send_whatsapp",
  "send_email",
  "send_gmail",
  "send_outlook",
  "google_calendar_create_event",
  "google_calendar_update_event",
  "google_calendar_delete_event",
  "internal_notification",
  "webhook",
  "create_appointment",
  "create_client",
  "update_client",
  "send_sms",
  "ai_rank_lead",
  "ai_classify_lead",
  "ai_auto_tag",
  "ai_detect_hot_lead",
  "ai_lead_brief",
  "ai_draft_followup",
  "ai_draft_email",
  "ai_suggest_next_action",
  "ai_daily_leads_digest",
  "ai_daily_agenda_digest",
]);

const NON_BILLABLE_ACTION_KEYS = new Set(["delay", "stop", "wait_until"]);

const NON_BILLABLE_NODE_TYPES = new Set([
  "trigger",
  "condition",
  "router",
  "delay",
]);

const ACTION_ALIASES: Record<string, string> = {
  whatsapp_template: "send_whatsapp",
  update_status: "update_lead_status",
  notify: "internal_notification",
  wait_until: "delay",
};

const CRM_LEAD_CREATE_ACTION = "crm_lead_create";

export function normalizeActionKey(raw: unknown): string {
  const key = String(raw || "").trim();
  if (!key) return "";
  return ACTION_ALIASES[key] || key;
}

export type AutomationActionCostInput = {
  nodeType?: string;
  type?: string;
  actionKey?: string;
  key?: string;
  special?: string;
};

export function getAutomationActionCost(
  input: AutomationActionCostInput = {}
): 0 | 1 {
  const nodeType = String(input.nodeType || input.type || "")
    .trim()
    .toLowerCase();
  const rawActionKey = input.actionKey || input.key || "";
  const actionKey =
    normalizeActionKey(rawActionKey) || String(rawActionKey || "").trim();

  if (
    input.special === CRM_LEAD_CREATE_ACTION ||
    actionKey === CRM_LEAD_CREATE_ACTION
  ) {
    return 1;
  }

  if (NON_BILLABLE_NODE_TYPES.has(nodeType)) {
    return 0;
  }

  if (!actionKey) {
    return 0;
  }

  if (NON_BILLABLE_ACTION_KEYS.has(actionKey)) {
    return 0;
  }

  if (BILLABLE_ACTION_KEYS.has(actionKey)) {
    return 1;
  }

  if (nodeType === "action") {
    return 1;
  }

  return 0;
}

export function nodeBillingBadgeLabel(
  input: AutomationActionCostInput = {}
): string {
  if (String(input.actionKey || input.key || "").startsWith("ai_")) return "פעולת אוטומציה";
  return getAutomationActionCost(input) > 0 ? "⚡ 1 פעולה" : "ללא חיוב";
}

export type EstimateGraphNode = {
  id?: string;
  type?: string;
  data?: { actionKey?: string; [key: string]: unknown } | null;
};

export type EstimateGraphEdge = {
  source?: string;
  target?: string;
};

/** Max billable actions along any single path (no mutual-exclusive summing). */
export function estimateMaxPathActionCost(
  nodes: EstimateGraphNode[] = [],
  edges: EstimateGraphEdge[] = []
): number {
  const byId = new Map((nodes || []).map((n) => [String(n.id), n]));
  const adj = new Map<string, string[]>();
  for (const e of edges || []) {
    const s = String(e.source || "");
    if (!s) continue;
    if (!adj.has(s)) adj.set(s, []);
    adj.get(s)!.push(String(e.target || ""));
  }

  const triggers = (nodes || []).filter((n) => n.type === "trigger");
  let maxCost = 0;

  function walk(nodeId: string, visited: Set<string>, acc: number) {
    if (!nodeId || visited.has(nodeId)) {
      maxCost = Math.max(maxCost, acc);
      return;
    }
    const node = byId.get(nodeId);
    if (!node) {
      maxCost = Math.max(maxCost, acc);
      return;
    }
    const nextVisited = new Set(visited);
    nextVisited.add(nodeId);
    const cost = getAutomationActionCost({
      nodeType: node.type,
      actionKey: node.data?.actionKey,
    });
    const nextAcc = acc + cost;
    const children = (adj.get(nodeId) || []).filter(Boolean);
    if (!children.length) {
      maxCost = Math.max(maxCost, nextAcc);
      return;
    }
    for (const child of children) {
      walk(child, nextVisited, nextAcc);
    }
  }

  if (!triggers.length) {
    for (const n of nodes || []) walk(String(n.id), new Set(), 0);
  } else {
    for (const t of triggers) {
      const children = adj.get(String(t.id)) || [];
      if (!children.length) maxCost = Math.max(maxCost, 0);
      for (const child of children) walk(child, new Set([String(t.id)]), 0);
    }
  }

  return maxCost;
}
