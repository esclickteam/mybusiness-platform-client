import React, { useState } from "react";
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
import type { BuyingType, CampaignObjective } from "./adsManagerTypes";
import { metaBtnPrimary, metaBtnSecondary, metaSelectClass } from "./metaAdsUi";

export type CreateCampaignChoice = {
  buyingType: BuyingType;
  objective: CampaignObjective;
};

const OBJECTIVES: Array<{
  id: CampaignObjective;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: "OUTCOME_AWARENESS",
    label: "Awareness",
    icon: Megaphone,
    description:
      "Show your ads to people who are most likely to remember them. Helping you reach people who haven’t heard of your business yet.",
  },
  {
    id: "OUTCOME_TRAFFIC",
    label: "Traffic",
    icon: MousePointer2,
    description:
      "Send people to a destination, such as your website, app or Messenger conversation.",
  },
  {
    id: "OUTCOME_ENGAGEMENT",
    label: "Engagement",
    icon: MessageCircle,
    description:
      "Get more messages, video views, post engagement, Page likes or event responses.",
  },
  {
    id: "OUTCOME_LEADS",
    label: "Leads",
    icon: Filter,
    description:
      "Collect leads for your business or brand. Create ads that collect info from people interested in your offering.",
  },
  {
    id: "OUTCOME_APP_PROMOTION",
    label: "App promotion",
    icon: Users,
    description:
      "Get people to install your app and make in-app purchases, or take specific in-app actions.",
  },
  {
    id: "OUTCOME_SALES",
    label: "Sales",
    icon: ShoppingBag,
    description:
      "Find people likely to purchase your product or service. Drive conversions on your website or app.",
  },
];

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
  const [tab, setTab] = useState<"campaign" | "adset">("campaign");
  const [buyingType, setBuyingType] = useState<BuyingType>("auction");
  const [objective, setObjective] = useState<CampaignObjective | "">("");
  const [hovered, setHovered] = useState<CampaignObjective | "">("");

  if (!open) return null;

  const activeObjective = hovered || objective;
  const activeMeta = OBJECTIVES.find((o) => o.id === activeObjective);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-3 sm:p-6">
      <div
        dir="ltr"
        className="flex max-h-[min(720px,92vh)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-[#CED0D4] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-campaign-title"
      >
        {/* Header tabs */}
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
              Create new campaign
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
              New ad set or ad
            </button>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="mr-2 rounded-md p-1.5 text-[#65676B] hover:bg-[#F0F2F5]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {tab === "adset" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[17px] font-bold text-[#050505]">
              New ad set or ad
            </p>
            <p className="mt-2 max-w-md text-[14px] text-[#65676B]">
              Select an existing campaign in Ads Manager overview first, then
              add an ad set or ad under it. To start fresh, use Create new
              campaign.
            </p>
            <button
              type="button"
              className={`${metaBtnSecondary} mt-5`}
              onClick={() => setTab("campaign")}
            >
              Back to create campaign
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
                  Choose a buying type{" "}
                  <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#8A8D91] text-[10px] font-bold text-[#65676B]">
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
                  <option value="auction">Auction</option>
                  <option value="reserved">Reserved</option>
                </select>

                <h3 className="mt-6 text-[15px] font-bold text-[#050505]">
                  Choose a campaign objective
                </h3>
                <div className="mt-3 space-y-1">
                  {OBJECTIVES.map((item) => {
                    const Icon = item.icon;
                    const selected = objective === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setObjective(item.id)}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered("")}
                        className={[
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition",
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
                          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                        </span>
                        <span className="text-[15px] font-semibold text-[#050505]">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="hidden border-l border-[#E4E6EB] bg-[#F7F8FA] px-4 py-5 md:block">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[#E7F3FF] to-[#F0F2F5]">
                  <div className="relative">
                    <MapPinned className="h-14 w-14 text-[#1877F2]/0.85" />
                    <Compass className="absolute -bottom-1 -right-2 h-7 w-7 text-[#65676B]" />
                  </div>
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-[#65676B]">
                  {activeMeta
                    ? activeMeta.description
                    : "Your campaign objective is the business goal you hope to achieve by running your ads. Hover over each one for more information."}
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
                About campaign objectives
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={metaBtnSecondary}
                  onClick={onCancel}
                >
                  Cancel
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
                  Continue
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function campaignNameForObjective(objective: CampaignObjective): string {
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
