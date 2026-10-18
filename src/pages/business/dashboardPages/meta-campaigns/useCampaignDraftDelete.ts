import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { deleteLocalCampaignDraft, type MetaCampaign } from "../../../../api/metaCampaignsApi";
import { deleteFailureMessage, isLocalCampaignDraft } from "./campaignListDeletion";

export function useCampaignDraftDelete(
  businessId: string | null,
  onRemoved: (id: string) => void
) {
  const { t } = useTranslation();
  const onRemovedRef = useRef(onRemoved);
  onRemovedRef.current = onRemoved;
  const lock = useRef(false);
  const [target, setTarget] = useState<MetaCampaign | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function ask(campaign: MetaCampaign) {
    if (busy || lock.current) return;
    setError("");
    setTarget(campaign);
  }

  function close() {
    if (busy || lock.current) return;
    setTarget(null);
    setError("");
  }

  async function confirm() {
    if (!target || !isLocalCampaignDraft(target) || !businessId) return;
    if (lock.current) return;
    lock.current = true;
    const current = target;
    setBusy(true);
    setError("");
    try {
      await deleteLocalCampaignDraft(businessId, current.publishRecordId || current.id);
      onRemovedRef.current(current.id);
      setTarget(null);
      toast.success(t("metaCampaigns.actions.draftDeleted"));
    } catch (err) {
      setError(deleteFailureMessage(err, t, current.name));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  return { target, error, busy, ask, confirm, close };
}
