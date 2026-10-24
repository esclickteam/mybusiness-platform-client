/**
 * Dev-only visual QA for Meta Ads Manager–style detailed targeting.
 * Uses local fixture rows shaped like Meta targetingbrowse / targetingsearch.
 */
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/i18n";
import type { MetaDetailedTarget } from "../../api/metaCampaignsApi";
import type { AdSetDetailedTarget } from "../business/dashboardPages/meta-campaigns/ads-manager/adsManagerTypes";
import AdsManagerDetailedTargetingSection from "../business/dashboardPages/meta-campaigns/ads-manager/editors/AdsManagerDetailedTargetingSection";

const FIXTURE: MetaDetailedTarget[] = [
  {
    id: "",
    name: "Education",
    type: "education_statuses",
    branch: "demographics",
    selectable: false,
    path: ["Demographics", "Education"],
  },
  {
    id: "6000000000001",
    name: "In college",
    type: "education_statuses",
    branch: "demographics",
    selectable: true,
    path: ["Demographics", "Education", "In college"],
  },
  {
    id: "",
    name: "Life Events",
    type: "life_events",
    branch: "demographics",
    selectable: false,
    path: ["Demographics", "Life Events"],
  },
  {
    id: "6005149512172",
    name: "Newlywed (1 year)",
    type: "life_events",
    branch: "demographics",
    selectable: true,
    path: ["Demographics", "Life Events", "Newlywed (1 year)"],
    description: "People who got married in the past year",
    audienceSize: 18000000,
  },
  {
    id: "",
    name: "__ROOT__",
    type: "interests",
    branch: "interests",
    selectable: false,
    path: [],
  },
  {
    id: "",
    name: "Business and industry",
    type: "interests",
    branch: "interests",
    selectable: false,
    path: ["Interests", "Business and industry"],
  },
  {
    id: "",
    name: "Banking (finance)",
    type: "interests",
    branch: "interests",
    selectable: false,
    path: ["Interests", "Business and industry", "Banking (finance)"],
  },
  {
    id: "6003063638807",
    name: "Investment banking",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: [
      "Interests",
      "Business and industry",
      "Banking (finance)",
      "Investment banking",
    ],
    audienceSize: 120000000,
  },
  {
    id: "6002714398399",
    name: "Small business",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Business and industry", "Small business"],
    audienceSize: 420000000,
  },
  {
    id: "6003395860999",
    name: "Entrepreneurship",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Business and industry", "Entrepreneurship"],
    audienceSize: 310000000,
  },
  {
    id: "",
    name: "Shopping and fashion",
    type: "interests",
    branch: "interests",
    selectable: false,
    path: ["Interests", "Shopping and fashion"],
  },
  {
    id: "6003380760119",
    name: "Online shopping",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Shopping and fashion", "Online shopping"],
    audienceSize: 890000000,
  },
  {
    id: "",
    name: "Purchase behavior",
    type: "behaviors",
    branch: "behaviors",
    selectable: false,
    path: ["Behaviors", "Purchase behavior"],
  },
  {
    id: "6002714895372",
    name: "Engaged shoppers",
    type: "behaviors",
    branch: "behaviors",
    selectable: true,
    path: ["Behaviors", "Purchase behavior", "Engaged shoppers"],
    audienceSize: 700000000,
  },
  {
    id: "",
    name: "Travel",
    type: "behaviors",
    branch: "behaviors",
    selectable: false,
    path: ["Behaviors", "Travel"],
  },
  {
    id: "6004854404172",
    name: "Frequent travelers",
    type: "behaviors",
    branch: "behaviors",
    selectable: true,
    path: ["Behaviors", "Travel", "Frequent travelers"],
    audienceSize: 210000000,
  },
  {
    id: "",
    name: "College years",
    type: "college_years",
    branch: "demographics",
    selectable: false,
    unsupportedReason: "category_not_selectable",
    path: ["Demographics", "Education", "College years"],
  },
  {
    id: "999001",
    name: "Legacy demographic cluster",
    type: "demographics",
    branch: "demographics",
    selectable: false,
    unsupportedReason: "unsupported_flexible_spec",
    path: ["Demographics", "Other", "Legacy demographic cluster"],
  },
  {
    id: "6002867432822",
    name: "יופי (קונספט חברתי)",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Shopping and fashion", "יופי (קונספט חברתי)"],
    audienceSize: 500000000,
  },
];

async function mockBrowse() {
  await new Promise((r) => setTimeout(r, 120));
  return { success: true, results: FIXTURE };
}

async function mockSearch(_businessId: string | undefined, query: { q: string }) {
  await new Promise((r) => setTimeout(r, 120));
  const q = String(query.q || "").toLowerCase();
  return {
    success: true,
    results: FIXTURE.filter(
      (row) =>
        row.selectable &&
        row.id &&
        `${row.name} ${(row.path || []).join(" ")}`.toLowerCase().includes(q)
    ),
  };
}

async function mockSuggest(
  _businessId: string | undefined,
  query?: { sort?: string }
) {
  await new Promise((r) => setTimeout(r, 80));
  const rows = FIXTURE.filter((row) => row.selectable && row.id);
  const sorted =
    query?.sort === "size"
      ? rows
          .slice()
          .sort(
            (a, b) => (Number(b.audienceSize) || 0) - (Number(a.audienceSize) || 0)
          )
      : rows;
  return {
    success: true,
    results: sorted.slice(0, 12),
    source: "browse_catalog_empty_state",
    sort: query?.sort || "relevance",
  };
}

export default function DetailedTargetingVisualQaPage() {
  const [selected, setSelected] = useState<AdSetDetailedTarget[]>([]);
  const [lang, setLang] = useState<"he" | "en">("he");

  useEffect(() => {
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen bg-[#F0F2F5] p-6" data-testid="detailed-targeting-qa">
        <div className="mx-auto max-w-xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-lg font-bold text-[#050505]">
              Detailed targeting QA
            </h1>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border border-[#CED0D4] bg-white px-3 py-1 text-sm font-semibold"
                onClick={() => setLang("he")}
              >
                HE
              </button>
              <button
                type="button"
                className="rounded border border-[#CED0D4] bg-white px-3 py-1 text-sm font-semibold"
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#CED0D4] bg-white p-4 shadow-sm">
            <AdsManagerDetailedTargetingSection
              businessId="qa-business"
              selected={selected}
              onChange={setSelected}
              browseFn={mockBrowse as never}
              searchFn={mockSearch as never}
              suggestFn={mockSuggest as never}
            />
          </div>

          <pre
            className="overflow-auto rounded-lg border border-[#CED0D4] bg-white p-3 text-[11px] text-[#050505]"
            data-testid="selected-json"
          >
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      </div>
    </I18nextProvider>
  );
}
