import React from "react";
import { useTranslation } from "react-i18next";
import { metaBtnPrimary, metaBtnSecondary } from "./metaAdsUi";
import { metaCtaLabel } from "./metaAdCtas";

type Props = {
  open: boolean;
  currentCta: string;
  suggestedCta: string;
  onAccept: () => void;
  onKeep: () => void;
};

export default function CtaCompatibilityDialog({
  open,
  currentCta,
  suggestedCta,
  onAccept,
  onKeep,
}: Props) {
  const { t } = useTranslation();
  if (!open) return null;
  const current = metaCtaLabel(currentCta, t);
  const suggested = metaCtaLabel(suggestedCta, t);
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      data-testid="cta-compatibility-dialog"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h2 className="text-[17px] font-bold text-[#050505]">
          {t("metaCampaigns.adsManager.chrome.ctaConfirmTitle")}
        </h2>
        <p className="mt-2 text-[14px] leading-snug text-[#65676B]">
          {t("metaCampaigns.adsManager.chrome.ctaConfirmBody", {
            current,
            suggested,
          })}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className={metaBtnSecondary} onClick={onKeep}>
            {t("metaCampaigns.adsManager.chrome.ctaConfirmKeep")}
          </button>
          <button type="button" className={metaBtnPrimary} onClick={onAccept}>
            {t("metaCampaigns.adsManager.chrome.ctaConfirmAccept", { suggested })}
          </button>
        </div>
      </div>
    </div>
  );
}
