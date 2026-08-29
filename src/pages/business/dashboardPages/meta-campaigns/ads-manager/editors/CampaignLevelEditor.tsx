import React from "react";
import { useTranslation } from "react-i18next";
import type { CampaignDraft } from "../adsManagerTypes";
import {
  MetaField,
  MetaLinkButton,
  MetaRadioCard,
  MetaSection,
  metaBtnSecondary,
  metaInputClass,
  metaSelectClass,
} from "../metaAdsUi";

const OBJECTIVES: Array<{ id: CampaignDraft["objective"] }> = [
  { id: "OUTCOME_AWARENESS" },
  { id: "OUTCOME_TRAFFIC" },
  { id: "OUTCOME_ENGAGEMENT" },
  { id: "OUTCOME_LEADS" },
  { id: "OUTCOME_APP_PROMOTION" },
  { id: "OUTCOME_SALES" },
];

type Props = {
  campaign: CampaignDraft;
  onChange: (patch: Partial<CampaignDraft>) => void;
};

export default function CampaignLevelEditor({ campaign, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-[760px] space-y-4 pb-24">
      <MetaSection
        title={t("metaCampaigns.adsManager.campaignName")}
        action={
          <button type="button" className={metaBtnSecondary}>
            {t("metaCampaigns.adsManager.createTemplate")}
          </button>
        }
      >
        <MetaField label={t("metaCampaigns.adsManager.campaignName")}>
          <input
            className={metaInputClass}
            value={campaign.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </MetaField>
      </MetaSection>

      <MetaSection title={t("metaCampaigns.adsManager.campaignDetails")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <MetaField label={t("metaCampaigns.adsManager.buyingType")}>
            <select
              className={metaSelectClass}
              value={campaign.buyingType}
              onChange={(e) =>
                onChange({
                  buyingType: e.target.value as CampaignDraft["buyingType"],
                })
              }
            >
              <option value="auction">
                {t("metaCampaigns.adsManager.auction")}
              </option>
              <option value="reserved">
                {t("metaCampaigns.adsManager.reserved")}
              </option>
            </select>
          </MetaField>
          <MetaField label={t("metaCampaigns.adsManager.campaignObjective")}>
            <select
              className={metaSelectClass}
              value={campaign.objective}
              onChange={(e) =>
                onChange({
                  objective: e.target.value as CampaignDraft["objective"],
                })
              }
            >
              {OBJECTIVES.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {t(`metaCampaigns.adsManager.objectives.${obj.id}`)}
                </option>
              ))}
            </select>
          </MetaField>
        </div>
        <MetaLinkButton
          onClick={() =>
            onChange({ showMoreDetails: !campaign.showMoreDetails })
          }
        >
          {campaign.showMoreDetails
            ? t("metaCampaigns.adsManager.hideOptions")
            : t("metaCampaigns.adsManager.showMoreOptions")}
        </MetaLinkButton>
        {campaign.showMoreDetails ? (
          <MetaField
            label={t("metaCampaigns.adsManager.specialAdCategories")}
            hint={t("metaCampaigns.adsManager.specialAdHint")}
          >
            <select className={metaSelectClass} defaultValue="">
              <option value="">{t("metaCampaigns.adsManager.none")}</option>
              <option value="credit">{t("metaCampaigns.adsManager.credit")}</option>
              <option value="employment">
                {t("metaCampaigns.adsManager.employment")}
              </option>
              <option value="housing">{t("metaCampaigns.adsManager.housing")}</option>
            </select>
          </MetaField>
        ) : null}
      </MetaSection>

      <MetaSection title={t("metaCampaigns.adsManager.budget")}>
        <div>
          <p className="mb-2 text-[13px] font-semibold text-[#65676B]">
            {t("metaCampaigns.adsManager.budgetStrategy")}
          </p>
          <div className="grid gap-2">
            <MetaRadioCard
              checked={campaign.budgetStrategy === "campaign"}
              onSelect={() => onChange({ budgetStrategy: "campaign" })}
              title={t("metaCampaigns.adsManager.campaignBudget")}
              description={t("metaCampaigns.adsManager.campaignBudgetHint")}
            />
            <MetaRadioCard
              checked={campaign.budgetStrategy === "adset"}
              onSelect={() => onChange({ budgetStrategy: "adset" })}
              title={t("metaCampaigns.adsManager.adSetBudget")}
              description={t("metaCampaigns.adsManager.adSetBudgetHint")}
            />
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr_90px] gap-2">
          <select
            className={metaSelectClass}
            value={campaign.budgetType}
            onChange={(e) =>
              onChange({
                budgetType: e.target.value as CampaignDraft["budgetType"],
              })
            }
          >
            <option value="daily">
              {t("metaCampaigns.adsManager.dailyBudget")}
            </option>
            <option value="lifetime">
              {t("metaCampaigns.adsManager.lifetimeBudget")}
            </option>
          </select>
          <input
            className={metaInputClass}
            value={campaign.budgetAmount}
            onChange={(e) => onChange({ budgetAmount: e.target.value })}
            inputMode="decimal"
          />
          <input
            className={metaInputClass}
            value={campaign.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
          />
        </div>
        <p className="text-[13px] text-[#65676B]">
          {t("metaCampaigns.adsManager.budgetAverage", {
            currency: campaign.currency,
            amount: campaign.budgetAmount,
          })}
        </p>

        <MetaField label={t("metaCampaigns.adsManager.bidStrategy")}>
          <select
            className={metaSelectClass}
            value={campaign.bidStrategy}
            onChange={(e) => onChange({ bidStrategy: e.target.value })}
          >
            <option value="Highest volume">
              {t("metaCampaigns.adsManager.highestVolume")}
            </option>
            <option value="Cost per result goal">
              {t("metaCampaigns.adsManager.costPerResult")}
            </option>
            <option value="Bid cap">{t("metaCampaigns.adsManager.bidCap")}</option>
          </select>
        </MetaField>

        <div className="flex flex-wrap items-center gap-4">
          <MetaLinkButton
            onClick={() =>
              onChange({ showMoreBudget: !campaign.showMoreBudget })
            }
          >
            {campaign.showMoreBudget
              ? t("metaCampaigns.adsManager.hideSettings")
              : t("metaCampaigns.adsManager.showMoreSettings")}
          </MetaLinkButton>
          <MetaLinkButton>
            {t("metaCampaigns.adsManager.budgetScheduling")}
          </MetaLinkButton>
        </div>
        {campaign.showMoreBudget ? (
          <MetaField
            label={t("metaCampaigns.adsManager.deliveryType")}
            hint={t("metaCampaigns.adsManager.deliveryHint")}
          >
            <select className={metaSelectClass} defaultValue="standard">
              <option value="standard">
                {t("metaCampaigns.adsManager.standard")}
              </option>
              <option value="accelerated">
                {t("metaCampaigns.adsManager.accelerated")}
              </option>
            </select>
          </MetaField>
        ) : null}
      </MetaSection>
    </div>
  );
}
