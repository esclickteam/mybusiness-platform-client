/** Local unpublished drafts must never look like a paused Meta campaign. */

export type CampaignStatusRow = {
  id?: string;
  localOnly?: boolean;
  status?: string;
  configuredStatus?: string;
  metaCampaignId?: string;
  name?: string;
};

export function isLiveMetaObjectId(id?: string | null): boolean {
  return /^\d{8,}$/.test(String(id || "").trim());
}

export function isUnpublishedLocalCampaign(row: CampaignStatusRow | null | undefined): boolean {
  if (!row) return true;
  if (row.localOnly) return true;
  const status = String(row.configuredStatus || row.status || "")
    .toUpperCase()
    .replace(/[^A-Z_]/g, "");
  if (status === "DRAFT") return true;
  const liveId = String(row.metaCampaignId || row.id || "").trim();
  return !isLiveMetaObjectId(liveId);
}

export function canToggleMetaDelivery(row: CampaignStatusRow | null | undefined): boolean {
  return !isUnpublishedLocalCampaign(row);
}

export function displayListStatus(row: CampaignStatusRow): string {
  const raw = String(row.configuredStatus || row.status || "")
    .toUpperCase()
    .replace(/[^A-Z_]/g, "");
  if (raw === "FAILED" || raw === "PARTIAL_FAILED") return raw;
  if (isUnpublishedLocalCampaign(row)) return "DRAFT";
  return raw || "DRAFT";
}

/** Names created by previous E2E / desktop-test runs. Never auto-delete. */
export function isQaTestDraftName(name?: string | null): boolean {
  const value = String(name || "");
  return /Bizuply DT|#\d+\s*QA|QA PAUSED|E2E PAUSED/i.test(value);
}
