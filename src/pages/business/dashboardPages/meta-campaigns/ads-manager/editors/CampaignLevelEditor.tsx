import React from "react";
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

const OBJECTIVES: Array<{ id: CampaignDraft["objective"]; label: string }> = [
  { id: "OUTCOME_AWARENESS", label: "Awareness" },
  { id: "OUTCOME_TRAFFIC", label: "Traffic" },
  { id: "OUTCOME_ENGAGEMENT", label: "Engagement" },
  { id: "OUTCOME_LEADS", label: "Leads" },
  { id: "OUTCOME_APP_PROMOTION", label: "App promotion" },
  { id: "OUTCOME_SALES", label: "Sales" },
];

type Props = {
  campaign: CampaignDraft;
  onChange: (patch: Partial<CampaignDraft>) => void;
};

export default function CampaignLevelEditor({ campaign, onChange }: Props) {
  return (
    <div className="mx-auto max-w-[760px] space-y-4 pb-24">
      <MetaSection
        title="Campaign name"
        action={
          <button type="button" className={metaBtnSecondary}>
            Create template
          </button>
        }
      >
        <MetaField label="Campaign name">
          <input
            className={metaInputClass}
            value={campaign.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </MetaField>
      </MetaSection>

      <MetaSection title="Campaign details">
        <div className="grid gap-4 sm:grid-cols-2">
          <MetaField label="Buying type">
            <select
              className={metaSelectClass}
              value={campaign.buyingType}
              onChange={(e) =>
                onChange({
                  buyingType: e.target.value as CampaignDraft["buyingType"],
                })
              }
            >
              <option value="auction">Auction</option>
              <option value="reserved">Reserved</option>
            </select>
          </MetaField>
          <MetaField label="Campaign objective">
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
                  {obj.label}
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
          {campaign.showMoreDetails ? "Hide options" : "Show more options"}
        </MetaLinkButton>
        {campaign.showMoreDetails ? (
          <MetaField
            label="Special ad categories"
            hint="Declare if your ads are related to credit, employment, housing, or social issues."
          >
            <select className={metaSelectClass} defaultValue="">
              <option value="">None</option>
              <option value="credit">Credit</option>
              <option value="employment">Employment</option>
              <option value="housing">Housing</option>
            </select>
          </MetaField>
        ) : null}
      </MetaSection>

      <MetaSection title="Budget">
        <div>
          <p className="mb-2 text-[13px] font-semibold text-[#65676B]">
            Budget strategy
          </p>
          <div className="grid gap-2">
            <MetaRadioCard
              checked={campaign.budgetStrategy === "campaign"}
              onSelect={() => onChange({ budgetStrategy: "campaign" })}
              title="Campaign budget"
              description="Set one budget at the campaign level and distribute it across ad sets."
            />
            <MetaRadioCard
              checked={campaign.budgetStrategy === "adset"}
              onSelect={() => onChange({ budgetStrategy: "adset" })}
              title="Ad set budget"
              description="Control budget separately for each ad set."
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
            <option value="daily">Daily budget</option>
            <option value="lifetime">Lifetime budget</option>
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
          You’ll spend an average of {campaign.currency} {campaign.budgetAmount}{" "}
          per day. Actual daily spend may vary.
        </p>

        <MetaField label="Campaign bid strategy">
          <select
            className={metaSelectClass}
            value={campaign.bidStrategy}
            onChange={(e) => onChange({ bidStrategy: e.target.value })}
          >
            <option>Highest volume</option>
            <option>Cost per result goal</option>
            <option>Bid cap</option>
          </select>
        </MetaField>

        <div className="flex flex-wrap items-center gap-4">
          <MetaLinkButton
            onClick={() =>
              onChange({ showMoreBudget: !campaign.showMoreBudget })
            }
          >
            {campaign.showMoreBudget ? "Hide settings" : "Show more settings"}
          </MetaLinkButton>
          <MetaLinkButton>Budget scheduling</MetaLinkButton>
        </div>
        {campaign.showMoreBudget ? (
          <MetaField
            label="Delivery type"
            hint="Standard delivery spends your budget evenly. Accelerated spends as quickly as possible."
          >
            <select className={metaSelectClass} defaultValue="standard">
              <option value="standard">Standard</option>
              <option value="accelerated">Accelerated</option>
            </select>
          </MetaField>
        ) : null}
      </MetaSection>
    </div>
  );
}
