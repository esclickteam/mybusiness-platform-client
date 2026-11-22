/** Local unpublished drafts must never look like a paused Meta campaign. */

export type CampaignStatusRow = {
  id?: string;
  localOnly?: boolean;
  status?: string;
  configuredStatus?: string;
  effectiveStatus?: string;
  deliveryStatus?: string;
  deliveryStatuses?: string[];
  deliverySyncError?: boolean;
  metaCampaignId?: string;
  name?: string;
};

export const DELIVERY_REFRESH_MS = 60_000;

export function shouldRefreshDelivery(visibility: string | undefined): boolean {
  return visibility === "visible";
}

function statusToken(value?: string | null): string {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, "");
}

export function campaignConfiguredOn(row: CampaignStatusRow | null | undefined): boolean {
  return statusToken(row?.configuredStatus || row?.status) === "ACTIVE";
}

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

/** Delivery labels in attention order. The on/off switch is not one of these. */
export function deliveryLabelStatuses(row: CampaignStatusRow): string[] {
  const configured = statusToken(row.configuredStatus || row.status);
  if (configured === "FAILED" || configured === "PARTIAL_FAILED") return [configured];
  if (isUnpublishedLocalCampaign(row)) return ["DRAFT"];
  const listed = (row.deliveryStatuses || []).map((status) => statusToken(status)).filter(Boolean);
  const unique: string[] = [];
  for (const status of listed) {
    if (!unique.includes(status)) unique.push(status);
  }
  if (unique.length) return unique;
  const delivery = statusToken(row.deliveryStatus || row.effectiveStatus);
  if (delivery) return [delivery];
  return [configured || "DRAFT"];
}

export function displayListStatus(row: CampaignStatusRow): string {
  return deliveryLabelStatuses(row)[0] || "DRAFT";
}

export function campaignMatchesStatusFilter(
  row: CampaignStatusRow,
  filter: string,
  listStatus: string
): boolean {
  if (!filter || filter === "all") return true;
  if (filter === "DRAFT" || filter === "FAILED" || filter === "PENDING_PUBLISH") {
    return listStatus === filter;
  }
  return deliveryLabelStatuses(row).includes(filter);
}

export type DeliveryRefreshRow = {
  id: string;
  status?: string;
  configuredStatus?: string;
  effectiveStatus?: string;
  deliveryStatus?: string;
  deliveryStatuses?: string[];
  deliverySyncError?: boolean;
};

/** Keep the last verified label when a refresh cannot read Meta. */
export function mergeDeliveryRefresh<T extends CampaignStatusRow & { id?: string }>(
  current: T[],
  incoming: DeliveryRefreshRow[] | null | undefined,
  options?: { failed?: boolean }
): T[] {
  if (options?.failed || !incoming) return current;
  const byId = new Map(incoming.map((row) => [row.id, row]));
  return current.map((row) => {
    const next = row.id ? byId.get(row.id) : undefined;
    if (!next) return row;
    const previous = statusToken(row.deliveryStatus || row.effectiveStatus);
    if (next.deliverySyncError && previous && previous !== "UNKNOWN") return row;
    const deliveryStatus = next.deliveryStatus || row.deliveryStatus;
    return {
      ...row,
      status: next.status || row.status,
      configuredStatus: next.configuredStatus || row.configuredStatus,
      deliveryStatus,
      deliveryStatuses: next.deliveryStatuses?.length ? next.deliveryStatuses : row.deliveryStatuses,
      effectiveStatus: deliveryStatus || next.effectiveStatus || row.effectiveStatus,
      deliverySyncError: Boolean(next.deliverySyncError),
    };
  });
}

/** Names created by previous E2E / desktop-test runs. Never auto-delete. */
export function isQaTestDraftName(name?: string | null): boolean {
  const value = String(name || "");
  return /Bizuply DT|#\d+\s*QA|QA PAUSED|E2E PAUSED/i.test(value);
}

export function hideQaDraftsStorageKey(businessId?: string | null): string {
  return `bizuply.meta.hideQaDrafts.${String(businessId || "default")}`;
}

/** Default is off; a stored "1"/"true" means the user turned the filter on. */
export function loadHideQaDrafts(
  storage: Pick<Storage, "getItem"> | null | undefined,
  businessId?: string | null
): boolean {
  if (!storage) return false;
  try {
    const raw = String(storage.getItem(hideQaDraftsStorageKey(businessId)) || "").trim().toLowerCase();
    if (raw === "1" || raw === "true") return true;
    return false;
  } catch {
    return false;
  }
}

export function saveHideQaDrafts(
  storage: Pick<Storage, "setItem"> | null | undefined,
  businessId: string | null | undefined,
  hide: boolean
): void {
  if (!storage) return;
  storage.setItem(hideQaDraftsStorageKey(businessId), hide ? "1" : "0");
}
