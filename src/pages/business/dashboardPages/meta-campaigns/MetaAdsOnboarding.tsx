import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import CreateCampaignButton from "./CreateCampaignButton";

type Props = {
  basePath: string;
  connected: boolean;
  hasAccount: boolean;
  hasPage: boolean;
  hasInstagram: boolean;
  hasCampaigns: boolean;
};

const STORAGE_PREFIX = "bizuply.metaAds.onboarding.dismissed.";

export default function MetaAdsOnboarding({
  basePath,
  connected,
  hasAccount,
  hasPage,
  hasInstagram,
  hasCampaigns,
}: Props) {
  const { t } = useTranslation();
  const storageKey = `${STORAGE_PREFIX}${basePath}`;
  const [hidden, setHidden] = useState(() => {
    try {
      return window.localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  });

  const steps = useMemo(
    () => [
      { done: connected, label: t("metaCampaigns.ux.onboardConnect"), href: `${basePath}/settings` },
      { done: hasAccount, label: t("metaCampaigns.ux.onboardAccount"), href: `${basePath}/settings` },
      { done: hasPage, label: t("metaCampaigns.ux.onboardPage"), href: `${basePath}/settings` },
      { done: hasInstagram, label: t("metaCampaigns.ux.onboardInstagram"), href: `${basePath}/settings`, optional: true },
      { done: hasCampaigns, label: t("metaCampaigns.ux.onboardCreate"), href: `${basePath}/campaigns` },
      { done: false, label: t("metaCampaigns.ux.onboardGoal"), href: `${basePath}/goals`, optional: true },
    ],
    [basePath, connected, hasAccount, hasCampaigns, hasInstagram, hasPage, t]
  );

  if (hidden || (connected && hasAccount && hasPage && hasCampaigns)) return null;

  return (
    <section className={`${cardBase} p-4`} data-testid="meta-ads-onboarding">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900">{t("metaCampaigns.ux.onboardTitle")}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">{t("metaCampaigns.ux.onboardSubtitle")}</p>
        </div>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            try {
              window.localStorage.setItem(storageKey, "1");
            } catch {
              /* ignore */
            }
            setHidden(true);
          }}
        >
          {t("metaCampaigns.ux.onboardSkip")}
        </button>
      </div>
      <ol className="mt-4 space-y-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2">
            <p className="text-sm font-bold text-slate-800">
              <span className={step.done ? "text-emerald-600" : "text-slate-400"}>{step.done ? "✓" : index + 1}.</span>{" "}
              {step.label}
              {step.optional ? (
                <span className="ms-2 text-xs font-semibold text-slate-400">{t("metaCampaigns.ux.optional")}</span>
              ) : null}
            </p>
            <Link to={step.href} className="text-xs font-black text-violet-700 underline">
              {t("metaCampaigns.ux.open")}
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <CreateCampaignButton basePath={basePath} />
        <Link to={`${basePath}/goals`} className={btnPrimary}>
          {t("metaCampaigns.ux.setGoalOptional")}
        </Link>
      </div>
    </section>
  );
}
