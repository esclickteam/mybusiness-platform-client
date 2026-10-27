import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import {
  deleteDialogCopy,
  isLocalCampaignDraft,
  type CampaignDeletionLevel,
  type CampaignDeletionRow,
} from "./campaignListDeletion";

type Props = {
  campaign?: (CampaignDeletionRow & { name: string }) | null;
  targets?: CampaignDeletionRow[];
  level?: CampaignDeletionLevel;
  busy: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function MetaCampaignDeleteDialog({
  campaign,
  targets,
  level = "campaign",
  busy,
  error,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const rows = targets?.length ? targets : campaign ? [campaign] : [];
  if (!rows.length) return null;
  const localOnly = rows.every((row) => isLocalCampaignDraft(row));
  const copy = deleteDialogCopy(t, level, rows.length);
  const names = rows.map((row) => row.name || row.id).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meta-campaign-delete-title"
      data-testid="meta-campaign-delete-dialog"
    >
      <div className={`${cardBase} w-full max-w-md p-5`}>
        <h3 id="meta-campaign-delete-title" className="text-lg font-black break-words" data-testid="meta-campaign-delete-name">
          {copy.title}
        </h3>
        {names.length ? (
          <p className="mt-2 text-sm font-semibold text-slate-500" data-testid="meta-campaign-delete-targets">
            {names.join(", ")}
          </p>
        ) : null}
        <p className="mt-2 text-sm font-semibold text-slate-700" data-testid="meta-campaign-delete-message">
          {copy.body}
        </p>
        {localOnly ? (
          <p className="mt-2 text-sm font-semibold text-slate-600">{t("metaCampaigns.actions.confirmDeleteDraftCascade")}</p>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm font-bold text-rose-700" role="alert" data-testid="meta-campaign-delete-error">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={`${btnSecondary} w-full sm:w-auto`} onClick={onClose} disabled={busy}>
            {t("common.cancel", { defaultValue: "ביטול" })}
          </button>
          <button
            type="button"
            className={`${btnPrimary} w-full sm:w-auto`}
            data-testid="meta-campaign-delete-confirm"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("metaCampaigns.actions.deleteCampaign")}
          </button>
        </div>
      </div>
    </div>
  );
}
