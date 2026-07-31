import React, { useState } from "react";
import {
  AlertCircle,
  Layers3,
  Megaphone,
  MoreHorizontal,
  RectangleHorizontal,
} from "lucide-react";
import type { AdsManagerLevel, AdsManagerTreeNode } from "./adsManagerTypes";

const levelIcon: Record<AdsManagerLevel, React.ElementType> = {
  campaign: Megaphone,
  adset: Layers3,
  ad: RectangleHorizontal,
};

type Props = {
  nodes: AdsManagerTreeNode[];
  selectedId: string;
  onSelect: (level: AdsManagerLevel, id: string) => void;
};

export default function MetaAdsManagerTree({
  nodes,
  selectedId,
  onSelect,
}: Props) {
  const [menuId, setMenuId] = useState<string | null>(null);

  const campaign = nodes.find((n) => n.level === "campaign");
  const adSets = nodes.filter((n) => n.level === "adset");
  const ads = nodes.filter((n) => n.level === "ad");

  const renderRow = (node: AdsManagerTreeNode, depth: number) => {
    const Icon = levelIcon[node.level];
    const selected = node.id === selectedId;
    return (
      <div key={node.id} className="relative">
        <button
          type="button"
          onClick={() => onSelect(node.level, node.id)}
          className={[
            "group flex w-full items-center gap-2 rounded-md py-1.5 pr-1 text-left transition",
            selected
              ? "bg-[#E7F3FF] text-[#1877F2]"
              : "text-[#050505] hover:bg-[#F0F2F5]",
          ].join(" ")}
          style={{ paddingLeft: 8 + depth * 14 }}
        >
          <Icon
            className={[
              "h-4 w-4 shrink-0",
              selected ? "text-[#1877F2]" : "text-[#65676B]",
            ].join(" ")}
          />
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
            {node.name}
          </span>
          {node.validation !== "none" ? (
            <AlertCircle
              className={[
                "h-3.5 w-3.5 shrink-0",
                node.validation === "error"
                  ? "text-[#FA383E]"
                  : "text-[#F7B928]",
              ].join(" ")}
            />
          ) : null}
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setMenuId((prev) => (prev === node.id ? null : node.id));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setMenuId((prev) => (prev === node.id ? null : node.id));
              }
            }}
            className="rounded p-1 text-[#65676B] opacity-0 hover:bg-black/5 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </span>
        </button>
        {menuId === node.id ? (
          <div className="absolute right-1 top-8 z-20 min-w-[150px] rounded-md border border-[#CED0D4] bg-white py-1 shadow-lg">
            {["Rename", "Duplicate", "Delete"].map((item) => (
              <button
                key={item}
                type="button"
                className="block w-full px-3 py-1.5 text-left text-[13px] text-[#050505] hover:bg-[#F0F2F5]"
                onClick={() => setMenuId(null)}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <nav
      aria-label="Campaign structure"
      className="flex h-full flex-col border-r border-[#CED0D4] bg-[#F7F8FA]"
    >
      <div className="border-b border-[#E4E6EB] px-3 py-2.5">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#65676B]">
          Campaign structure
        </p>
      </div>
      <div className="flex-1 space-y-0.5 overflow-y-auto px-1.5 py-2">
        {campaign ? renderRow(campaign, 0) : null}
        {adSets.map((adSet) => (
          <div key={adSet.id}>
            {renderRow(adSet, 1)}
            {ads
              .filter((ad) => ad.parentId === adSet.id)
              .map((ad) => renderRow(ad, 2))}
          </div>
        ))}
      </div>
    </nav>
  );
}
