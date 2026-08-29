import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Compass,
  Filter,
  MapPinned,
  Megaphone,
  MessageCircle,
  MousePointer2,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { useLocaleDir } from "../../../../../hooks/useLocaleDir";
import type { BuyingType, CampaignObjective } from "./adsManagerTypes";
import { metaBtnPrimary, metaBtnSecondary, metaSelectClass } from "./metaAdsUi";

export type CreateCampaignChoice = {
  buyingType: BuyingType;
  objective: CampaignObjective;
};

const OBJECTIVE_IDS: CampaignObjective[] = [
  "OUTCOME_AWARENESS",
  "OUTCOME_TRAFFIC",
  "OUTCOME_ENGAGEMENT",
  "OUTCOME_LEADS",
  "OUTCOME_APP_PROMOTION",
  "OUTCOME_SALES",
];

const OBJECTIVE_ICONS: Record<CampaignObjective, React.ElementType> = {
  OUTCOME_AWARENESS: Megaphone,
  OUTCOME_TRAFFIC: MousePointer2,
  OUTCOME_ENGAGEMENT: MessageCircle,
  OUTCOME_LEADS: Filter,
  OUTCOME_APP_PROMOTION: Users,
  OUTCOME_SALES: ShoppingBag,
};

type Props = {
  open: boolean;
  onCancel: () => void;
  onContinue: (choice: CreateCampaignChoice) => void;
};

export default function CreateCampaignObjectiveModal({
  open,
  onCancel,
  onContinue,
}: Props) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [tab, setTab] = useState<"campaign" | "adset">("campaign");
  const [buyingType, setBuyingType] = useState<BuyingType>("auction");
  const [objective, setObjective] = useState<CampaignObjective | "">("");
  const [hovered, setHovered] = useState<CampaignObjective | "">("");

  if (!open) return null;

  const activeObjective = hovered || objective;
  const fallbackHelp = t("metaCampaigns.adsManager.objectiveFallback");
  const activeHelp = activeObjective
    ? t(`metaCampaigns.adsManager.objectiveHelp.${activeObjective}`)
    : fallbackHelp;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-3 sm:p-6">
      <div
        dir={dir}
        className="flex max-h-[min(720px,92vh)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-[#CED0D4] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-campaign-title"
        data-testid="meta-ads-objective-modal"
      >
        <div className="flex items-center justify-between border-b border-[#E4E6EB] px-2 pt-2">
          <div className="flex items-end gap-0.5">
            <button
              type="button"
              onClick={() => setTab("campaign")}
              className={[
                "rounded-t-lg px-3.5 py-2.5 text-[15px] font-semibold",
                tab === "campaign"
                  ? "bg-[#E7F3FF] text-[#1877F2]"
                  : "text-[#65676B] hover:bg-[#F0F2F5]",
              ].join(" ")}
            >
              {t("metaCampaigns.adsManager.createNewCampaign")}
            </button>
            <button
              type="button"
              onClick={() => setTab("adset")}
              className={[
                "rounded-t-lg px-3.5 py-2.5 text-[15px] font-semibold",
                tab === "adset"
                  ? "bg-[#E7F3FF] text-[#1877F2]"
                  : "text-[#65676B] hover:bg-[#F0F2F5]",
              ].join(" ")}
            >
              {t("metaCampaigns.adsManager.newAdSetOrAd")}
            </button>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1.5 text-[#65676B] hover:bg-[#F0F2F5] ltr:mr-2 rtl:ml-2"
            aria-label={t("metaCampaigns.adsManager.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {tab === "adset" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[17px] font-bold text-[#050505]">
              {t("metaCampaigns.adsManager.newAdSetOrAd")}
            </p>
            <p className="mt-2 max-w-md text-[14px] text-[#65676B]">
              {t("metaCampaigns.adsManager.newAdSetHint")}
            </p>
            <button
              type="button"
              className={`${metaBtnSecondary} mt-5`}
              onClick={() => setTab("campaign")}
            >
              {t("metaCampaigns.adsManager.backToCreateCampaign")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="overflow-y-auto px-5 py-4">
                <h2
                  id="create-campaign-title"
                  className="text-[15px] font-bold text-[#050505]"
                >
                  {t("metaCampaigns.adsManager.chooseBuyingType")}{" "}
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#8A8D91] text-[10px] font-bold text-[#65676B] ltr:ml-1 rtl:mr-1">
                    i
                  </span>
                </h2>
                <select
                  className={`${metaSelectClass} mt-2 max-w-full`}
                  value={buyingType}
                  onChange={(e) =>
                    setBuyingType(e.target.value as BuyingType)
                  }
                >
                  <option value="auction">
                    {t("metaCampaigns.adsManager.auction")}
                  </option>
                  <option value="reserved">
                    {t("metaCampaigns.adsManager.reserved")}
                  </option>
                </select>

                <h3 className="mt-6 text-[15px] font-bold text-[#050505]">
                  {t("metaCampaigns.adsManager.chooseObjective")}
                </h3>
                <div className="mt-3 space-y-1">
                  {OBJECTIVE_IDS.map((id) => {
                    const Icon = OBJECTIVE_ICONS[id];
                    const selected = objective === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setObjective(id)}
                        onMouseEnter={() => setHovered(id)}
                        onMouseLeave={() => setHovered("")}
                        className={[
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 transition",
                          dir === "rtl" ? "text-right" : "text-left",
                          selected
                            ? "border-[#1877F2] bg-[#E7F3FF]"
                            : "border-transparent hover:bg-[#F0F2F5]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                            selected ? "border-[#1877F2]" : "border-[#8A8D91]",
                          ].join(" ")}
                        >
                          {selected ? (
                            <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                          ) : null}
                        </span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F2F5] text-[#1C1E21]">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-[15px] font-semibold text-[#050505]">
                          {t(`metaCampaigns.adsManager.objectives.${id}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="hidden bg-[#F7F8FA] px-4 py-5 md:block ltr:border-l rtl:border-r border-[#E4E6EB]">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[#E7F3FF] to-[#F0F2F5]">
                  <div className="relative">
                    <MapPinned className="h-14 w-14 text-[#1877F2]/0.85" />
                    <Compass className="absolute -bottom-1 h-7 w-7 text-[#65676B] ltr:-right-2 rtl:-left-2" />
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-[#65676B]">
                  {activeHelp}
                </p>
              </aside>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E6EB] px-5 py-3">
              <a
                href="https://www.facebook.com/business/help/143841220645335"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold text-[#1877F2] hover:underline"
              >
                {t("metaCampaigns.adsManager.aboutObjectives")}
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={metaBtnSecondary}
                  onClick={onCancel}
                >
                  {t("metaCampaigns.adsManager.cancel")}
                </button>
                <button
                  type="button"
                  className={metaBtnPrimary}
                  disabled={!objective}
                  onClick={() => {
                    if (!objective) return;
                    onContinue({ buyingType, objective });
                  }}
                >
                  {t("metaCampaigns.adsManager.continue")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function campaignNameForObjective(
  objective: CampaignObjective,
  t?: (key: string) => string
): string {
  const key = `metaCampaigns.adsManager.campaignNames.${objective}`;
  if (t) {
    const translated = t(key);
    if (translated && translated !== key) return translated;
    return t("metaCampaigns.adsManager.campaignNames.fallback");
  }
  const map: Record<CampaignObjective, string> = {
    OUTCOME_AWARENESS: "New awareness campaign",
    OUTCOME_TRAFFIC: "New traffic campaign",
    OUTCOME_ENGAGEMENT: "New engagement campaign",
    OUTCOME_LEADS: "New leads campaign",
    OUTCOME_APP_PROMOTION: "New app promotion campaign",
    OUTCOME_SALES: "New sales campaign",
  };
  return map[objective] || "New campaign";
}
