export type CampaignDeletionRow = {
  id?: string;
  localOnly?: boolean;
  metaCampaignId?: string;
};

export function isLocalCampaignDraft(campaign: CampaignDeletionRow | null | undefined) {
  if (!campaign?.localOnly) return false;
  return !String(campaign.metaCampaignId || "").trim();
}

type DeleteErrorBody = {
  error?: string;
  code?: string;
};

export function deleteFailureMessage(
  error: unknown,
  t: (key: string, options?: Record<string, unknown>) => string,
  name = ""
) {
  const data = (error as { response?: { data?: DeleteErrorBody } })?.response?.data;
  const code = String(data?.code || "");
  if (code === "FORBIDDEN") return t("metaCampaigns.errors.deleteForbidden");
  if (code === "DELETE_IN_PROGRESS") return t("metaCampaigns.errors.deleteInProgress");
  if (code === "META_LIST_REMOVAL_BLOCKED" || code === "DRAFT_ALREADY_ON_META") {
    return t("metaCampaigns.actions.metaDeleteBlockedBody", { name });
  }
  const server = typeof data?.error === "string" ? data.error.trim() : "";
  if (/[\u0590-\u05FF]/.test(server)) return server;
  return t("metaCampaigns.errors.deleteCampaignKept");
}

export function removeCampaignFromList<T extends { id: string }>(rows: T[], id: string) {
  return rows.filter((row) => row.id !== id);
}
