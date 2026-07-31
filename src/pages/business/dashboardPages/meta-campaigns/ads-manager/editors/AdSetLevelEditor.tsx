import React from "react";
import type { AdSetDraft } from "../adsManagerTypes";
import {
  MetaField,
  MetaLinkButton,
  MetaNotice,
  MetaSection,
  MetaTag,
  MetaToggle,
  metaBtnSecondary,
  metaInputClass,
  metaSelectClass,
} from "../metaAdsUi";

type Props = {
  adSet: AdSetDraft;
  onChange: (patch: Partial<AdSetDraft>) => void;
};

export default function AdSetLevelEditor({ adSet, onChange }: Props) {
  return (
    <div className="mx-auto max-w-[760px] space-y-4 pb-24">
      <MetaSection
        title="Ad set name"
        action={
          <button type="button" className={metaBtnSecondary}>
            Create template
          </button>
        }
      >
        <MetaField label="Ad set name">
          <input
            className={metaInputClass}
            value={adSet.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </MetaField>
      </MetaSection>

      <MetaSection
        title="Conversion"
        status={adSet.conversionEvent ? "ok" : "warn"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <MetaField label="Conversion location">
            <select
              className={metaSelectClass}
              value={adSet.conversionLocation}
              onChange={(e) => onChange({ conversionLocation: e.target.value })}
            >
              <option>Instant forms</option>
              <option>Website</option>
              <option>Website and instant forms</option>
              <option>Messenger</option>
            </select>
          </MetaField>
          <MetaField label="Performance goal">
            <select
              className={metaSelectClass}
              value={adSet.performanceGoal}
              onChange={(e) => onChange({ performanceGoal: e.target.value })}
            >
              <option>Maximize number of leads</option>
              <option>Maximize conversion value</option>
              <option>Maximize number of conversions</option>
            </select>
          </MetaField>
          <MetaField label="Dataset">
            <select
              className={metaSelectClass}
              value={adSet.dataset}
              onChange={(e) => onChange({ dataset: e.target.value })}
            >
              <option>BizUply Pixel</option>
              <option>No dataset</option>
            </select>
          </MetaField>
          <MetaField label="Conversion event">
            <select
              className={metaSelectClass}
              value={adSet.conversionEvent}
              onChange={(e) => onChange({ conversionEvent: e.target.value })}
            >
              <option value="">Select event</option>
              <option value="Lead">Lead</option>
              <option value="CompleteRegistration">Complete registration</option>
              <option value="Contact">Contact</option>
            </select>
          </MetaField>
        </div>

        {!adSet.conversionEvent ? (
          <MetaNotice tone="warning">
            Set up a conversion event so Meta can optimize delivery for leads.
            Without an event, delivery may be limited.
          </MetaNotice>
        ) : null}

        <MetaField label="Attribution model">
          <select
            className={metaSelectClass}
            value={adSet.attributionModel}
            onChange={(e) => onChange({ attributionModel: e.target.value })}
          >
            <option>7-day click, 1-day view</option>
            <option>1-day click</option>
            <option>7-day click</option>
          </select>
        </MetaField>

        <MetaLinkButton
          onClick={() =>
            onChange({ showMoreConversion: !adSet.showMoreConversion })
          }
        >
          {adSet.showMoreConversion ? "Hide options" : "Show more options"}
        </MetaLinkButton>

        {adSet.showMoreConversion ? (
          <div className="rounded-lg border border-[#E4E6EB] bg-[#F7F8FA] px-3.5 py-3">
            <p className="text-[15px] font-semibold text-[#050505]">
              Value rules
            </p>
            <p className="mt-1 text-[13px] text-[#65676B]">
              Adjust bid multipliers for audiences that are more or less
              valuable to your business.
            </p>
            <button type="button" className={`${metaBtnSecondary} mt-3`}>
              Create value rule set
            </button>
          </div>
        ) : null}
      </MetaSection>

      <MetaSection title="Dynamic creative">
        <MetaToggle
          checked={adSet.dynamicCreative}
          onChange={(dynamicCreative) => onChange({ dynamicCreative })}
          label="Dynamic creative"
          description="Automatically deliver the best combinations of your creative assets."
        />
      </MetaSection>

      <MetaSection title="Budget & schedule">
        <MetaNotice tone="info">
          Budget strategy: Controlled at campaign level. This ad set will use
          the shared campaign budget.
        </MetaNotice>

        <MetaToggle
          checked={adSet.spendingLimitEnabled}
          onChange={(spendingLimitEnabled) =>
            onChange({ spendingLimitEnabled })
          }
          label="Ad set spending limits"
          description="Optional min/max daily spend for this ad set."
        />
        {adSet.spendingLimitEnabled ? (
          <div className="grid grid-cols-2 gap-3">
            <MetaField label="Min spend">
              <input
                className={metaInputClass}
                value={adSet.spendingLimitMin}
                onChange={(e) =>
                  onChange({ spendingLimitMin: e.target.value })
                }
              />
            </MetaField>
            <MetaField label="Max spend">
              <input
                className={metaInputClass}
                value={adSet.spendingLimitMax}
                onChange={(e) =>
                  onChange({ spendingLimitMax: e.target.value })
                }
              />
            </MetaField>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <MetaField label="Start date">
            <input
              type="date"
              className={metaInputClass}
              value={adSet.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </MetaField>
          <MetaField label="Start time">
            <input
              type="time"
              className={metaInputClass}
              value={adSet.startTime}
              onChange={(e) => onChange({ startTime: e.target.value })}
            />
          </MetaField>
        </div>

        <label className="flex items-center gap-2 text-[14px] font-semibold text-[#050505]">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#1877F2]"
            checked={adSet.endDateEnabled}
            onChange={(e) => onChange({ endDateEnabled: e.target.checked })}
          />
          Set an end date
        </label>
        {adSet.endDateEnabled ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaField label="End date">
              <input
                type="date"
                className={metaInputClass}
                value={adSet.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
              />
            </MetaField>
            <MetaField label="End time">
              <input
                type="time"
                className={metaInputClass}
                value={adSet.endTime}
                onChange={(e) => onChange({ endTime: e.target.value })}
              />
            </MetaField>
          </div>
        ) : null}

        <MetaLinkButton
          onClick={() => onChange({ showMoreBudget: !adSet.showMoreBudget })}
        >
          {adSet.showMoreBudget ? "Hide settings" : "Show more settings"}
        </MetaLinkButton>
      </MetaSection>

      <MetaSection
        title="Audience"
        action={<MetaTag>Advantage+ on</MetaTag>}
      >
        <MetaField label="Use a saved audience">
          <select
            className={metaSelectClass}
            value={adSet.savedAudienceId}
            onChange={(e) => onChange({ savedAudienceId: e.target.value })}
          >
            <option value="">Don’t use a saved audience</option>
            <option value="aud_il_25_45">Israel · 25–45</option>
            <option value="aud_lookalike">Lookalike · Purchasers 1%</option>
          </select>
        </MetaField>

        <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
          <p className="text-[15px] font-bold text-[#050505]">Controls</p>
          <div className="mt-3 space-y-3">
            <MetaField label="Locations">
              <input
                className={metaInputClass}
                value={adSet.locationsSummary}
                onChange={(e) => onChange({ locationsSummary: e.target.value })}
                placeholder="Search locations"
              />
            </MetaField>
            <MetaLinkButton
              onClick={() =>
                onChange({ showMoreAudience: !adSet.showMoreAudience })
              }
            >
              {adSet.showMoreAudience
                ? "Hide more controls"
                : "Show more controls"}
            </MetaLinkButton>
            {adSet.showMoreAudience ? (
              <MetaField label="Age">
                <select className={metaSelectClass} defaultValue="18-65">
                  <option value="18-65">18 – 65+</option>
                  <option value="25-45">25 – 45</option>
                  <option value="18-34">18 – 34</option>
                </select>
              </MetaField>
            ) : null}
          </div>
        </div>

        <MetaToggle
          checked={adSet.suggestAudience}
          onChange={(suggestAudience) => onChange({ suggestAudience })}
          label="Suggest an audience"
          description="Get recommendations based on your Page and Pixel activity."
        />

        <MetaField label="Include these custom audiences">
          <input
            className={metaInputClass}
            placeholder="Search existing audiences"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value.trim();
                if (!value) return;
                onChange({
                  includeCustomAudiences: [
                    ...adSet.includeCustomAudiences,
                    value,
                  ],
                });
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
        </MetaField>
        {adSet.includeCustomAudiences.length ? (
          <div className="flex flex-wrap gap-2">
            {adSet.includeCustomAudiences.map((name) => (
              <span
                key={name}
                className="rounded-full bg-[#E7F3FF] px-2.5 py-1 text-[12px] font-semibold text-[#1877F2]"
              >
                {name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button type="button" className={metaBtnSecondary}>
            Create new
          </button>
          <button type="button" className={metaBtnSecondary}>
            Show suggestions
          </button>
          <button type="button" className={metaBtnSecondary}>
            Save audience
          </button>
        </div>

        <MetaToggle
          checked={adSet.furtherLimitReach}
          onChange={(furtherLimitReach) => onChange({ furtherLimitReach })}
          label="Further limit the reach of your ads"
          description="Exclude custom audiences or apply detailed targeting expansions carefully."
        />
      </MetaSection>

      <MetaSection title="Ad transparency">
        <MetaField label="Advertiser">
          <select
            className={metaSelectClass}
            value={adSet.advertiserId}
            onChange={(e) => onChange({ advertiserId: e.target.value })}
          >
            <option value="biz_main">Your business</option>
            <option value="biz_agency">Agency account</option>
          </select>
        </MetaField>
        <MetaToggle
          checked={adSet.advertiserDifferentFromPayer}
          onChange={(advertiserDifferentFromPayer) =>
            onChange({ advertiserDifferentFromPayer })
          }
          label="The advertiser and payer are different"
        />
      </MetaSection>

      <MetaSection
        title="Placements"
        action={<MetaTag>Advantage+ on</MetaTag>}
      >
        <p className="text-[13px] leading-snug text-[#65676B]">
          Your ads will show in the places most likely to get you results across
          Facebook, Instagram, Audience Network and Messenger.
        </p>
        <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
          <p className="text-[15px] font-semibold text-[#050505]">
            Placement value rules
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            Create rules to adjust bids by placement.
          </p>
          <button type="button" className={`${metaBtnSecondary} mt-3`}>
            Create a rule set
          </button>
        </div>
        <MetaLinkButton
          onClick={() =>
            onChange({ showMorePlacements: !adSet.showMorePlacements })
          }
        >
          {adSet.showMorePlacements
            ? "Hide settings"
            : "Account controls · Show more settings"}
        </MetaLinkButton>
        {adSet.showMorePlacements ? (
          <MetaToggle
            checked={adSet.advantagePlacements}
            onChange={(advantagePlacements) =>
              onChange({ advantagePlacements })
            }
            label="Advantage+ placements"
            description="Let Meta choose the best placements for your ads."
          />
        ) : null}
      </MetaSection>
    </div>
  );
}
