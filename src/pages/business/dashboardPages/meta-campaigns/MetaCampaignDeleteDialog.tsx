import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import { isLocalCampaignDraft, type CampaignDeletionRow } from "./campaignListDeletion";

type Props = {
  campaign: (CampaignDeletionRow & { name: string }) | null;
  busy: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function MetaCampaignDeleteDialog({ campaign, busy, error, onClose, onConfirm }: Props) {
  const { t } = useTranslation();
  if (!campaign) return null;
  const local = isLocalCampaignDraft(campaign);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meta-campaign-delete-name"
      data-testid="meta-campaign-delete-dialog"
    >
      <div className={`${cardBase} w-full max-w-md p-5`}>
        <h3 id="meta-campaign-delete-name" className="text-lg font-black break-words" data-testid="meta-campaign-delete-name">
          {campaign.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-slate-700" data-testid="meta-campaign-delete-message">
          {t("metaCampaigns.actions.confirmDeleteCampaignMessage")}
        </p>
        {local ? (
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {t("metaCampaigns.actions.confirmDeleteDraftCascade")}
          </p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-amber-800" data-testid="meta-campaign-delete-blocked">
            {t("metaCampaigns.actions.metaDeleteBlockedBody", { name: campaign.name })}
          </p>
        )}
        {error ? (
          <p className="mt-3 text-sm font-bold text-rose-700" role="alert" data-testid="meta-campaign-delete-error">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={`${btnSecondary} w-full sm:w-auto`} onClick={onClose} disabled={busy}>
            {local ? t("common.cancel", { defaultValue: "Cancel" }) : t("metaCampaigns.actions.metaDeleteBlockedClose")}
          </button>
          {local ? (
            <button
              type="button"
              className={`${btnPrimary} w-full sm:w-auto`}
              data-testid="meta-campaign-delete-confirm"
              disabled={busy}
              onClick={onConfirm}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("metaCampaigns.actions.deleteCampaign")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
