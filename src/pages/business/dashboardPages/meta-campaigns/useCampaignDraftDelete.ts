import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { deleteMetaObjects, type MetaCampaign } from "../../../../api/metaCampaignsApi";
import {
  deleteFailureMessage,
  isLocalCampaignDraft,
  type CampaignDeletionLevel,
  type CampaignDeletionRow,
} from "./campaignListDeletion";

export function useCampaignDraftDelete(
  businessId: string | null,
  onRemoved: (id: string, extra?: { ids?: string[] }) => void
) {
  const { t } = useTranslation();
  const onRemovedRef = useRef(onRemoved);
  onRemovedRef.current = onRemoved;
  const lock = useRef(false);
  const [targets, setTargets] = useState<CampaignDeletionRow[]>([]);
  const [level, setLevel] = useState<CampaignDeletionLevel>("campaign");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function ask(campaign: MetaCampaign | CampaignDeletionRow, nextLevel: CampaignDeletionLevel = "campaign") {
    if (busy || lock.current) return;
    setError("");
    setLevel(nextLevel);
    setTargets([campaign]);
  }

  function askMany(rows: CampaignDeletionRow[], nextLevel: CampaignDeletionLevel = "campaign") {
    if (busy || lock.current || !rows.length) return;
    setError("");
    setLevel(nextLevel);
    setTargets(rows);
  }

  function close() {
    if (busy || lock.current) return;
    setTargets([]);
    setError("");
  }

  async function confirm() {
    if (!targets.length || !businessId) return;
    if (lock.current) return;
    lock.current = true;
    const current = targets;
    setBusy(true);
    setError("");
    try {
      const payload = await deleteMetaObjects(
        businessId,
        current.map((row) => ({
          id: isLocalCampaignDraft(row) ? row.publishRecordId || row.id || "" : row.id || "",
          level,
          name: row.name,
          campaignId: row.campaignId || row.metaCampaignId,
          adSetId: row.adSetId,
        })),
        { confirm: true }
      );
      const deletedIds = payload.deletedIds?.length
        ? payload.deletedIds
        : payload.results.filter((row) => row.ok).map((row) => row.id);
      const failed = payload.failed?.length ? payload.failed : payload.results.filter((row) => !row.ok);
      if (deletedIds.length) {
        onRemovedRef.current(deletedIds[0], { ids: deletedIds });
        if (!failed.length) {
          toast.success(
            deletedIds.length > 1
              ? t("metaCampaigns.actions.deletedOnMetaMany", { ok: deletedIds.length })
              : current.every((row) => isLocalCampaignDraft(row))
                ? t("metaCampaigns.actions.draftDeleted")
                : t("metaCampaigns.actions.deletedOnMeta")
          );
        }
      }
      if (failed.length) {
        const names = failed.map((row) => row.name || row.id).join(", ");
        const message = failed.length === current.length
          ? failed[0]?.error || deleteFailureMessage({ response: { data: failed[0] } }, t, names)
          : t("metaCampaigns.actions.deletePartial", { names });
        setError(message);
        toast.error(message);
        if (!deletedIds.length) return;
      }
      if (!failed.length) setTargets([]);
    } catch (err) {
      setError(deleteFailureMessage(err, t, current[0]?.name || ""));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  return {
    target: targets[0] || null,
    targets,
    level,
    error,
    busy,
    ask,
    askMany,
    confirm,
    close,
  };
}
