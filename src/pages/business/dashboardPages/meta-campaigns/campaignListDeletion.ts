export type CampaignDeletionLevel = "campaign" | "adset" | "ad";

export type CampaignDeletionRow = {
  id?: string;
  name?: string;
  localOnly?: boolean;
  metaCampaignId?: string;
  publishRecordId?: string;
  campaignId?: string;
  adSetId?: string;
  level?: CampaignDeletionLevel;
};

export function isLocalCampaignDraft(campaign: CampaignDeletionRow | null | undefined) {
  if (!campaign?.localOnly) return false;
  return !String(campaign.metaCampaignId || "").trim();
}

export function isLiveMetaObject(row: CampaignDeletionRow | null | undefined) {
  return /^\d{8,}$/.test(String(row?.id || "").trim());
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
  if (code === "DELETE_NOT_CONFIRMED") return t("metaCampaigns.actions.confirmDeleteCampaignTitle");
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

export function removeCampaignsFromList<T extends { id: string }>(rows: T[], ids: string[]) {
  const hide = new Set(ids);
  return rows.filter((row) => !hide.has(row.id));
}

export function deleteDialogCopy(
  t: (key: string, options?: Record<string, unknown>) => string,
  level: CampaignDeletionLevel,
  count: number
) {
  const many = count > 1;
  if (level === "adset") {
    return {
      title: t(many ? "metaCampaigns.actions.confirmDeleteAdSetTitleMany" : "metaCampaigns.actions.confirmDeleteAdSetTitle"),
      body: t(many ? "metaCampaigns.actions.confirmDeleteAdSetMessageMany" : "metaCampaigns.actions.confirmDeleteAdSetMessage"),
    };
  }
  if (level === "ad") {
    return {
      title: t(many ? "metaCampaigns.actions.confirmDeleteAdTitleMany" : "metaCampaigns.actions.confirmDeleteAdTitle"),
      body: t(many ? "metaCampaigns.actions.confirmDeleteAdMessageMany" : "metaCampaigns.actions.confirmDeleteAdMessage"),
    };
  }
  return {
    title: t(many ? "metaCampaigns.actions.confirmDeleteCampaignTitleMany" : "metaCampaigns.actions.confirmDeleteCampaignTitle"),
    body: t(many ? "metaCampaigns.actions.confirmDeleteCampaignMessageMany" : "metaCampaigns.actions.confirmDeleteCampaignMessage"),
  };
}
