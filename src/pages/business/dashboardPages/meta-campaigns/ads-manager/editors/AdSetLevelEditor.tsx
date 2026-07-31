import React, { useEffect, useMemo, useRef, useState } from "react";
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

const PERFORMANCE_GOALS = [
  {
    id: "Maximize number of leads",
    description:
      "We'll try to show your ads to the people most likely to share their contact information with you.",
  },
  {
    id: "Maximize number of qualified leads",
    description:
      "We'll try to show your ads to the people most likely to convert after sharing their contact information with you.",
  },
];

export default function AdSetLevelEditor({
  adSet,
  onChange,
  businessId,
  pages,
  selectedPageId,
}: Props) {
  const [pageQuery, setPageQuery] = useState("");
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const [perfOpen, setPerfOpen] = useState(false);
  const pageMenuRef = useRef<HTMLDivElement | null>(null);

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

      <MetaSection title="Conversion" status="ok">
        <div>
          <p className="text-[15px] font-bold text-[#050505]">
            Conversion location
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            Choose where you want to generate leads.{" "}
            <a
              href="https://www.facebook.com/business/help"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#1877F2] hover:underline"
            >
              About conversion locations
            </a>
          </p>
          <select
            className={`${metaSelectClass} mt-2`}
            value={adSet.conversionLocation}
            onChange={(e) => onChange({ conversionLocation: e.target.value })}
          >
            <option>Instant forms</option>
            <option>Website</option>
            <option>Website and instant forms</option>
            <option>Messenger</option>
          </select>
        </div>

        {usesInstantForms ? (
          <div ref={pageMenuRef} className="relative">
            <p className="flex items-center gap-1 text-[15px] font-bold text-[#050505]">
              Facebook Page
              <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
            </p>
            <p className="mt-1 text-[13px] text-[#65676B]">
              Choose the Page you want to promote.
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
                      ? "Select a Facebook Page"
                      : "No Pages connected — open Meta connection")}
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
                    placeholder="Search by Page name or ID"
                    value={pageQuery}
                    onChange={(e) => setPageQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-[12px] font-bold text-[#65676B]">
                  <span>Personal</span>
                  <span>{filteredPages.length} Pages</span>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredPages.length === 0 ? (
                    <p className="px-3 py-4 text-[13px] text-[#65676B]">
                      No Pages found. Connect Meta and grant Page access in
                      Settings.
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
                  Can&apos;t find a Page? Learn more
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="relative">
          <p className="text-[15px] font-bold text-[#050505]">
            Performance goal
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            How you measure success for your ads.{" "}
            <a
              href="https://www.facebook.com/business/help"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#1877F2] hover:underline"
            >
              About performance goals
            </a>
          </p>
          <button
            type="button"
            className={`${metaInputClass} mt-2 flex items-center justify-between text-left`}
            onClick={() => setPerfOpen((v) => !v)}
          >
            <span className="font-semibold">{adSet.performanceGoal}</span>
            <ChevronDown className="h-4 w-4 text-[#65676B]" />
          </button>
          {perfOpen ? (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#CED0D4] bg-white shadow-lg">
              {PERFORMANCE_GOALS.map((goal) => {
                const selected = adSet.performanceGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    className={[
                      "flex w-full gap-3 px-3 py-3 text-left",
                      selected ? "bg-[#E7F3FF]" : "hover:bg-[#F0F2F5]",
                    ].join(" ")}
                    onClick={() => {
                      onChange({ performanceGoal: goal.id });
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
                        {goal.id}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-[#65676B]">
                        {goal.description}
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
            Cost per result goal
          </p>
          <p className="mt-1 text-[14px] font-semibold text-[#050505]">
            {adSet.costPerResultGoal || "None"}
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-[#A6D9B3] bg-[#E7F6EC] px-3 py-2.5 text-[13px] text-[#050505]">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#31A24C]" />
          <span>
            You could get more conversions from preferred audiences when age,
            gender and locations are set clearly.
          </span>
        </div>

        {!usesInstantForms ? (
          <div className="grid gap-4 sm:grid-cols-2">
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
        ) : null}

        <MetaLinkButton
          onClick={() =>
            onChange({ showMoreConversion: !adSet.showMoreConversion })
          }
        >
          {adSet.showMoreConversion ? "Hide options" : "Show more options"}
        </MetaLinkButton>
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
      </MetaSection>

      <MetaSection title="Audience" action={<MetaTag>Advantage+ on</MetaTag>}>
        <p className="text-[13px] text-[#65676B]">
          We won&apos;t reach people beyond these settings, even with Advantage+
          on.
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
            Suggest an audience
            <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
          </p>
          <p className="mt-1 text-[13px] text-[#65676B]">
            We&apos;ll reach people beyond these settings when it&apos;s likely
            to improve performance.
          </p>
          <p className="mt-3 text-[13px] font-semibold text-[#65676B]">
            Include these custom audiences
          </p>
          <p className="mt-0.5 text-[14px] font-semibold text-[#050505]">
            {adSet.includeCustomAudiences.length
              ? adSet.includeCustomAudiences.join(", ")
              : "None"}
          </p>
          <MetaLinkButton
            onClick={() =>
              onChange({ suggestAudience: !adSet.suggestAudience })
            }
          >
            {adSet.suggestAudience ? "Hide suggestions" : "Show suggestions"}
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
                      Age
                      <Info className="h-3.5 w-3.5 text-[#65676B]" />
                    </span>
                    {!adSet.furtherLimitReach ? (
                      <span className="rounded-full bg-[#E4E6EB] px-2 py-0.5 text-[11px] font-semibold text-[#65676B]">
                        Your suggestion
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
                      aria-label="Minimum age"
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
                      aria-label="Maximum age"
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
                          {age >= 65 ? "65+" : age}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="bg-white px-3 py-2 text-[14px] font-semibold text-[#050505]">
                    {adSet.ageMin} -{" "}
                    {adSet.ageMax >= 65 ? "65+" : adSet.ageMax}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
                <p className="text-[15px] font-bold text-[#050505]">Gender</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "All genders"],
                      ["male", "Men"],
                      ["female", "Women"],
                    ] as const
                  ).map(([value, label]) => (
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
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#E4E6EB] px-3.5 py-3">
                <p className="text-[15px] font-bold text-[#050505]">
                  Detailed targeting
                </p>
                <p className="mt-1 text-[14px] font-semibold text-[#050505]">
                  All demographics, interests and behaviors
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
            label="Further limit the reach of your ads"
          />
          <button type="button" className={metaBtnSecondary}>
            Save audience
          </button>
        </div>
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

      <MetaSection title="Placements" action={<MetaTag>Advantage+ on</MetaTag>}>
        <p className="text-[13px] leading-snug text-[#65676B]">
          Your ads will show in the places most likely to get you results across
          Facebook, Instagram, Audience Network and Messenger.
        </p>
        <MetaToggle
          checked={adSet.advantagePlacements}
          onChange={(advantagePlacements) => onChange({ advantagePlacements })}
          label="Advantage+ placements"
          description="Let Meta choose the best placements for your ads."
        />
      </MetaSection>
    </div>
  );
}
