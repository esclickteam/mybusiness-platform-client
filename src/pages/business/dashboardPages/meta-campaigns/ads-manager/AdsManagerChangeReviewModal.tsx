import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import type { AdsManagerChange } from "./adsManagerDiff";
import { metaBtnPrimary, metaBtnSecondary } from "./metaAdsUi";

type Props = {
  open: boolean;
  saving: boolean;
  changes: AdsManagerChange[];
  onCancel: () => void;
  onConfirm: () => void;
};

export default function AdsManagerChangeReviewModal({
  open,
  saving,
  changes,
  onCancel,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const c = (key: string) => t(`metaCampaigns.adsManager.chrome.${key}`);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <h2 className="text-[18px] font-black text-[#050505]">{c("changeReviewTitle")}</h2>
        <p className="mt-1 text-[13px] font-semibold text-[#65676B]">{c("changeReviewSubtitle")}</p>
        <ul className="mt-4 space-y-2">
          {changes.map((change) => (
            <li
              key={change.id}
              className={[
                "rounded-lg border px-3 py-2 text-[13px]",
                change.spendImpact
                  ? "border-amber-200 bg-amber-50"
                  : "border-[#E4E6EB] bg-[#F7F8FA]",
              ].join(" ")}
            >
              <p className="font-black text-[#050505]">
                {c(change.labelKey)}
                {change.spendImpact ? (
                  <span className="ms-2 text-[11px] font-bold uppercase text-amber-800">
                    {c("spendImpact")}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 font-semibold text-[#65676B]">
                {change.oldValue} → {change.newValue}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className={metaBtnSecondary} onClick={onCancel} disabled={saving}>
            {c("cancel")}
          </button>
          <button type="button" className={metaBtnPrimary} onClick={onConfirm} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? c("savingChanges") : c("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}
