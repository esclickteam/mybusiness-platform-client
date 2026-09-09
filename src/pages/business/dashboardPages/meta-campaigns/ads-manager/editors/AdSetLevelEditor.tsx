import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  TrendingUp,
} from "lucide-react";
import type { MetaAdsPage } from "../../../../../../api/metaCampaignsApi";
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
import AdsManagerLocationsSection from "./AdsManagerLocationsSection";

type Props = {
  adSet: AdSetDraft;
  onChange: (patch: Partial<AdSetDraft>) => void;
  businessId: string | null;
  pages: MetaAdsPage[];
  selectedPageId?: string;
};

const AGE_MIN_OPTIONS = Array.from({ length: 48 }, (_, i) => 18 + i); // 18..65
const AGE_MAX_OPTIONS = [...AGE_MIN_OPTIONS, 65];

// Store English id values for the Meta API; labels/descriptions are translated at render time.
const PERFORMANCE_GOAL_IDS = [
  "Maximize number of leads",
  "Maximize number of qualified leads",
];

export default function AdSetLevelEditor({
  adSet,
  onChange,
  businessId,
  pages,
  selectedPageId,
}: Props) {
  const { t } = useTranslation();
  const [pageQuery, setPageQuery] = useState("");
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);
  const pageMenuRef = useRef<HTMLDivElement | null>(null);

  const perfLabel = (id: string) => {
    if (id === "Maximize number of leads")
      return t("metaCampaigns.adsManager.chrome.maximizeLeads");
    if (id === "Maximize number of qualified leads")
      return t("metaCampaigns.adsManager.chrome.maximizeQualifiedLeads");
    if (id === "Maximize number of conversions")
      return t("metaCampaigns.adsManager.chrome.maximizeConversions");
    return id;
  };

  const perfDesc = (id: string) => {
    if (id === "Maximize number of leads")
      return t("metaCampaigns.adsManager.chrome.maximizeLeadsDesc");
    if (id === "Maximize number of qualified leads")
      return t("metaCampaigns.adsManager.chrome.maximizeQualifiedLeadsDesc");
    return "";
  };

  const usesInstantForms = String(adSet.conversionLocation)
    .toLowerCase()
    .includes("instant");

  const filteredPages = useMemo(() => {
    const q = pageQuery.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q)
    );
  }, [pages, pageQuery]);

  // Prefill Facebook Page from connected account when Instant forms is selected.
  useEffect(() => {
    if (!usesInstantForms) return;
    if (adSet.facebookPageId) return;
    const preferred =
      pages.find((p) => p.id === selectedPageId) || pages[0] || null;
    if (!preferred) return;
    onChange({
      facebookPageId: preferred.id,
      facebookPageName: preferred.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usesInstantForms, pages, selectedPageId, adSet.facebookPageId]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!pageMenuRef.current?.contains(e.target as Node)) {
        setPageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedPage =
    pages.find((p) => p.id === adSet.facebookPageId) ||
    (adSet.facebookPageId
      ? { id: adSet.facebookPageId, name: adSet.facebookPageName || adSet.facebookPageId }
      : null);

  return (
    <div className="mx-auto max-w-[760px] space-y-4 pb-24">
      <MetaSection
        title={t("metaCampaigns.adsManager.chrome.adSetName")}
        action={
          <button type="button" className={metaBtnSecondary}>
            {t("metaCampaigns.adsManager.chrome.createTemplate")}
          </button>
        }
      >
        <MetaField label={t("metaCampaigns.adsManager.chrome.adSetName")}>
          <input
            className={metaInputClass}
            value={adSet.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </MetaField>
      </MetaSection>

      <MetaSection
        title={t("metaCampaigns.adsManager.chrome.conversion")}
        status="ok"
      >
        <div>
          <p className="text-[15px] font-bold text-[#050505]">
            {t("metaCampaigns.adsManager.chrome.conversionLocation")}
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            {t("metaCampaigns.adsManager.chrome.conversionLocationHint")}{" "}
            <a
              href="https://www.facebook.com/business/help"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#1877F2] hover:underline"
            >
              {t("metaCampaigns.adsManager.chrome.aboutConversionLocations")}
            </a>
          </p>
          <select
            className={`${metaSelectClass} mt-2`}
            value={adSet.conversionLocation}
            onChange={(e) => onChange({ conversionLocation: e.target.value })}
          >
            <option value="Instant forms">
              {t("metaCampaigns.adsManager.chrome.instantForms")}
            </option>
            <option value="Website">
              {t("metaCampaigns.adsManager.chrome.website")}
            </option>
            <option value="Website and instant forms">
              {t("metaCampaigns.adsManager.chrome.websiteAndInstantForms")}
            </option>
            <option value="Messenger">
              {t("metaCampaigns.adsManager.chrome.messenger")}
            </option>
          </select>
        </div>

        {usesInstantForms ? (
          <div ref={pageMenuRef} className="relative">
            <p className="flex items-center gap-1 text-[15px] font-bold text-[#050505]">
              {t("metaCampaigns.adsManager.chrome.facebookPage")}
              <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
            </p>
            <p className="mt-1 text-[13px] text-[#65676B]">
              {t("metaCampaigns.adsManager.chrome.choosePageHint")}
            </p>
            <button
              type="button"
              className={`${metaInputClass} mt-2 flex items-center justify-between gap-2 text-left`}
              onClick={() => setPageMenuOpen((v) => !v)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#E4E6EB] text-[11px] font-bold text-[#65676B]">
                  {(selectedPage?.name || "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="truncate font-semibold">
                  {selectedPage?.name ||
                    (pages.length
                      ? t("metaCampaigns.adsManager.chrome.selectFacebookPage")
                      : t(
                          "metaCampaigns.adsManager.chrome.noPagesConnected"
                        ))}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#65676B]" />
            </button>

            {pageMenuOpen ? (
              <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-[#CED0D4] bg-white shadow-lg">
                <div className="relative border-b border-[#E4E6EB] p-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D91]" />
                  <input
                    className={`${metaInputClass} border-0 bg-[#F0F2F5] pl-9 shadow-none focus:shadow-none`}
                    placeholder={t(
                      "metaCampaigns.adsManager.chrome.searchPagePlaceholder"
                    )}
                    value={pageQuery}
                    onChange={(e) => setPageQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-[12px] font-bold text-[#65676B]">
                  <span>{t("metaCampaigns.adsManager.chrome.personal")}</span>
                  <span>
                    {t("metaCampaigns.adsManager.chrome.pagesCount", {
                      count: filteredPages.length,
                    })}
                  </span>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredPages.length === 0 ? (
                    <p className="px-3 py-4 text-[13px] text-[#65676B]">
                      {t("metaCampaigns.adsManager.chrome.noPagesFound")}
                    </p>
                  ) : (
                    filteredPages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        className={[
                          "flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-[#F0F2F5]",
                          page.id === adSet.facebookPageId
                            ? "bg-[#E7F3FF]"
                            : "",
                        ].join(" ")}
                        onClick={() => {
                          onChange({
                            facebookPageId: page.id,
                            facebookPageName: page.name,
                          });
                          setPageMenuOpen(false);
                          setPageQuery("");
                        }}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#E4E6EB] text-[12px] font-bold">
                          {page.name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold text-[#050505]">
                            {page.name}
                          </span>
                          <span className="block truncate text-[11px] text-[#65676B]" dir="ltr">
                            ID {page.id}
                          </span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <a
                  href="https://www.facebook.com/business/help"
                  target="_blank"
                  rel="noreferrer"
                  className="block border-t border-[#E4E6EB] px-3 py-2.5 text-[13px] font-semibold text-[#1877F2] hover:underline"
                >
                  {t("metaCampaigns.adsManager.chrome.cantFindPage")}
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="relative">
          <p className="text-[15px] font-bold text-[#050505]">
            {t("metaCampaigns.adsManager.chrome.performanceGoal")}
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            {t("metaCampaigns.adsManager.chrome.performanceGoalHint")}{" "}
            <a
              href="https://www.facebook.com/business/help"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#1877F2] hover:underline"
            >
              {t("metaCampaigns.adsManager.chrome.aboutPerformanceGoals")}
            </a>
          </p>
          <button
            type="button"
            className={`${metaInputClass} mt-2 flex items-center justify-between text-left`}
            onClick={() => setPerfOpen((v) => !v)}
          >
            <span className="font-semibold">
              {perfLabel(adSet.performanceGoal)}
            </span>
            <ChevronDown className="h-4 w-4 text-[#65676B]" />
          </button>
          {perfOpen ? (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#CED0D4] bg-white shadow-lg">
              {PERFORMANCE_GOAL_IDS.map((goalId) => {
                const selected = adSet.performanceGoal === goalId;
                return (
                  <button
                    key={goalId}
                    type="button"
                    className={[
                      "flex w-full gap-3 px-3 py-3 text-left",
                      selected ? "bg-[#E7F3FF]" : "hover:bg-[#F0F2F5]",
                    ].join(" ")}
                    onClick={() => {
                      onChange({ performanceGoal: goalId });
                      setPerfOpen(false);
                    }}
                  >
                    <span
                      className={[
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-[#1877F2]" : "border-[#8A8D91]",
                      ].join(" ")}
                    >
                      {selected ? (
                        <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                      ) : null}
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-[#050505]">
                        {perfLabel(goalId)}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-[#65676B]">
                        {perfDesc(goalId)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-[15px] font-bold text-[#050505]">
            {t("metaCampaigns.adsManager.chrome.costPerResultGoal")}
          </p>
          <p className="mt-1 text-[14px] font-semibold text-[#050505]">
            {adSet.costPerResultGoal ||
              t("metaCampaigns.adsManager.chrome.none")}
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-[#A6D9B3] bg-[#E7F6EC] px-3 py-2.5 text-[13px] text-[#050505]">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#31A24C]" />
          <span>
            {t("metaCampaigns.adsManager.chrome.preferredAudiencesHint")}
          </span>
        </div>

        {!usesInstantForms ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <MetaField label={t("metaCampaigns.adsManager.chrome.dataset")}>
              <select
                className={metaSelectClass}
                value={adSet.dataset}
                onChange={(e) => onChange({ dataset: e.target.value })}
              >
                <option value="BizUply Pixel">
                  {t("metaCampaigns.adsManager.chrome.bizuplyPixel")}
                </option>
                <option value="No dataset">
                  {t("metaCampaigns.adsManager.chrome.noDataset")}
                </option>
              </select>
            </MetaField>
            <MetaField
              label={t("metaCampaigns.adsManager.chrome.conversionEvent")}
            >
              <select
                className={metaSelectClass}
                value={adSet.conversionEvent}
                onChange={(e) => onChange({ conversionEvent: e.target.value })}
              >
                <option value="">
                  {t("metaCampaigns.adsManager.chrome.selectEvent")}
                </option>
                <option value="Lead">
                  {t("metaCampaigns.adsManager.chrome.eventLead")}
                </option>
                <option value="CompleteRegistration">
                  {t("metaCampaigns.adsManager.chrome.eventCompleteRegistration")}
                </option>
                <option value="Contact">
                  {t("metaCampaigns.adsManager.chrome.eventContact")}
                </option>
              </select>
            </MetaField>
          </div>
        ) : null}

        <MetaLinkButton
          onClick={() =>
            onChange({ showMoreConversion: !adSet.showMoreConversion })
          }
        >
          {adSet.showMoreConversion
            ? t("metaCampaigns.adsManager.chrome.hideOptions")
            : t("metaCampaigns.adsManager.chrome.showMoreOptions")}
        </MetaLinkButton>
      </MetaSection>

      <MetaSection title={t("metaCampaigns.adsManager.chrome.dynamicCreative")}>
        <MetaToggle
          checked={adSet.dynamicCreative}
          onChange={(dynamicCreative) => onChange({ dynamicCreative })}
          label={t("metaCampaigns.adsManager.chrome.dynamicCreative")}
          description={t(
            "metaCampaigns.adsManager.chrome.dynamicCreativeDesc"
          )}
        />
      </MetaSection>

      <MetaSection title={t("metaCampaigns.adsManager.chrome.budgetSchedule")}>
        <MetaNotice tone="info">
          {t("metaCampaigns.adsManager.chrome.budgetStrategyNotice")}
        </MetaNotice>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetaField label={t("metaCampaigns.adsManager.chrome.startDate")}>
            <input
              type="date"
              className={metaInputClass}
              value={adSet.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </MetaField>
          <MetaField label={t("metaCampaigns.adsManager.chrome.startTime")}>
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
          {t("metaCampaigns.adsManager.chrome.setEndDate")}
        </label>
        {adSet.endDateEnabled ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaField label={t("metaCampaigns.adsManager.chrome.endDate")}>
              <input
                type="date"
                className={metaInputClass}
                value={adSet.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
              />
            </MetaField>
            <MetaField label={t("metaCampaigns.adsManager.chrome.endTime")}>
              <input
                type="time"
                className={metaInputClass}
                value={adSet.endTime}
                onChange={(e) => onChange({ endTime: e.target.value })}
              />
            </MetaField>
          </div>
        ) : null}
      </MetaSection>

      <MetaSection
        title={t("metaCampaigns.adsManager.chrome.audience")}
        action={
          <MetaTag>{t("metaCampaigns.adsManager.chrome.advantageOn")}</MetaTag>
        }
      >
        <p className="text-[13px] text-[#65676B]">
          {t("metaCampaigns.adsManager.chrome.audienceLimitNote")}
        </p>

        <AdsManagerLocationsSection
          locations={adSet.locations}
          expanded={adSet.locationsExpanded}
          businessId={businessId}
          onExpandedChange={(locationsExpanded) =>
            onChange({ locationsExpanded })
          }
          onLocationsChange={(locations) =>
            onChange({
              locations,
              locationsSummary: locations
                .filter((l) => l.include !== false)
                .map((l) => l.name)
                .join(", "),
            })
          }
        />

        {/* Suggest an audience — Meta Advantage+ suggestions (age/gender) */}
        <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
          <p className="flex items-center gap-1 text-[15px] font-bold text-[#050505]">
            {t("metaCampaigns.adsManager.chrome.suggestAudience")}
            <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            {t("metaCampaigns.adsManager.chrome.suggestAudienceHint")}
          </p>
          <p className="mt-3 text-[13px] font-semibold text-[#65676B]">
            {t("metaCampaigns.adsManager.chrome.includeCustomAudiences")}
          </p>
          <p className="mt-0.5 text-[14px] font-semibold text-[#050505]">
            {adSet.includeCustomAudiences.length
              ? adSet.includeCustomAudiences.join(", ")
              : t("metaCampaigns.adsManager.chrome.none")}
          </p>
          <MetaLinkButton
            onClick={() =>
              onChange({ suggestAudience: !adSet.suggestAudience })
            }
          >
            {adSet.suggestAudience
              ? t("metaCampaigns.adsManager.chrome.hideSuggestions")
              : t("metaCampaigns.adsManager.chrome.showSuggestions")}
          </MetaLinkButton>

          {adSet.suggestAudience ? (
            <div className="mt-3 space-y-2 border-t border-[#E4E6EB] pt-3">
              {/* Age — Meta: collapsed shows range; expanded = two fields + Your suggestion */}
              <div className="overflow-hidden rounded-lg border border-[#CED0D4]">
                <button
                  type="button"
                  className={[
                    "flex w-full items-center justify-between px-3 py-2.5 text-left",
                    adSet.ageExpanded ? "bg-[#E7F3FF]" : "bg-white",
                  ].join(" ")}
                  onClick={() => onChange({ ageExpanded: !adSet.ageExpanded })}
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[15px] font-bold text-[#050505]">
                      {t("metaCampaigns.adsManager.chrome.age")}
                      <Info className="h-3.5 w-3.5 text-[#65676B]" />
                    </span>
                    {!adSet.furtherLimitReach ? (
                      <span className="rounded-full bg-[#E4E6EB] px-2 py-0.5 text-[11px] font-semibold text-[#65676B]">
                        {t("metaCampaigns.adsManager.chrome.yourSuggestion")}
                      </span>
                    ) : null}
                  </span>
                  {adSet.ageExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#65676B]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#65676B]" />
                  )}
                </button>
                {adSet.ageExpanded ? (
                  <div className="grid grid-cols-2 gap-2 bg-white px-3 py-3">
                    <select
                      className={metaSelectClass}
                      value={adSet.ageMin}
                      aria-label={t("metaCampaigns.adsManager.chrome.minAge")}
                      onChange={(e) => {
                        const ageMin = Number(e.target.value);
                        onChange({
                          ageMin,
                          ageMax: Math.max(ageMin, adSet.ageMax),
                        });
                      }}
                    >
                      {AGE_MIN_OPTIONS.map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>
                    <select
                      className={metaSelectClass}
                      value={adSet.ageMax}
                      aria-label={t("metaCampaigns.adsManager.chrome.maxAge")}
                      onChange={(e) => {
                        const ageMax = Number(e.target.value);
                        onChange({
                          ageMax,
                          ageMin: Math.min(adSet.ageMin, ageMax),
                        });
                      }}
                    >
                      {AGE_MAX_OPTIONS.map((age) => (
                        <option key={age} value={age}>
                          {age >= 65
                            ? t("metaCampaigns.adsManager.chrome.age65Plus")
                            : age}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="bg-white px-3 py-2 text-[14px] font-semibold text-[#050505]">
                    {adSet.ageMin} -{" "}
                    {adSet.ageMax >= 65
                      ? t("metaCampaigns.adsManager.chrome.age65Plus")
                      : adSet.ageMax}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
                <p className="text-[15px] font-bold text-[#050505]">
                  {t("metaCampaigns.adsManager.chrome.gender")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "genderAll"],
                      ["male", "genderMen"],
                      ["female", "genderWomen"],
                    ] as const
                  ).map(([value, labelKey]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onChange({ gender: value })}
                      className={[
                        "rounded-full border px-3 py-1.5 text-[13px] font-semibold",
                        adSet.gender === value
                          ? "border-[#1877F2] bg-[#E7F3FF] text-[#1877F2]"
                          : "border-[#CED0D4] bg-white text-[#050505] hover:bg-[#F0F2F5]",
                      ].join(" ")}
                    >
                      {t(`metaCampaigns.adsManager.chrome.${labelKey}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
                <p className="text-[15px] font-bold text-[#050505]">
                  {t("metaCampaigns.adsManager.chrome.detailedTargeting")}
                </p>
                <p className="mt-1 text-[14px] font-semibold text-[#050505]">
                  {t("metaCampaigns.adsManager.chrome.allDemographics")}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E6EB] pt-3">
          <MetaToggle
            checked={adSet.furtherLimitReach}
            onChange={(furtherLimitReach) =>
              onChange({
                furtherLimitReach,
                // Meta: further limit = hard constraints (not suggestions).
                advantageAudience: furtherLimitReach
                  ? false
                  : adSet.advantageAudience,
              })
            }
            label={t("metaCampaigns.adsManager.chrome.furtherLimitReach")}
          />
          <button type="button" className={metaBtnSecondary}>
            {t("metaCampaigns.adsManager.chrome.saveAudience")}
          </button>
        </div>
      </MetaSection>

      <MetaSection title={t("metaCampaigns.adsManager.chrome.adTransparency")}>
        <MetaField label={t("metaCampaigns.adsManager.chrome.advertiser")}>
          <select
            className={metaSelectClass}
            value={adSet.advertiserId}
            onChange={(e) => onChange({ advertiserId: e.target.value })}
          >
            <option value="biz_main">
              {t("metaCampaigns.adsManager.chrome.yourBusiness")}
            </option>
            <option value="biz_agency">
              {t("metaCampaigns.adsManager.chrome.agencyAccount")}
            </option>
          </select>
        </MetaField>
        <MetaToggle
          checked={adSet.advertiserDifferentFromPayer}
          onChange={(advertiserDifferentFromPayer) =>
            onChange({ advertiserDifferentFromPayer })
          }
          label={t("metaCampaigns.adsManager.chrome.advertiserPayerDifferent")}
        />
      </MetaSection>

      <MetaSection
        title={t("metaCampaigns.adsManager.chrome.placements")}
        action={
          <MetaTag>{t("metaCampaigns.adsManager.chrome.advantageOn")}</MetaTag>
        }
      >
        <p className="text-[13px] leading-snug text-[#65676B]">
          {t("metaCampaigns.adsManager.chrome.placementsHint")}
        </p>
        <MetaToggle
          checked={adSet.advantagePlacements}
          onChange={(advantagePlacements) => onChange({ advantagePlacements })}
          label={t("metaCampaigns.adsManager.chrome.advantagePlacements")}
          description={t(
            "metaCampaigns.adsManager.chrome.advantagePlacementsDesc"
          )}
        />
      </MetaSection>
    </div>
  );
}
