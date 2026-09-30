import React, { useState } from "react";
import {
  AlertCircle,
  Layers3,
  Megaphone,
  MoreHorizontal,
  RectangleHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const c = (key: string) => t(`metaCampaigns.adsManager.chrome.${key}`);
  const [menuId, setMenuId] = useState<string | null>(null);

  const menuItems: Array<{ key: string; label: string }> = [
    { key: "rename", label: c("treeRename") },
    { key: "duplicate", label: c("treeDuplicate") },
    { key: "delete", label: c("treeDelete") },
  ];

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
          data-demo-target={`meta-tree-${node.level}`}
          onClick={() => onSelect(node.level, node.id)}
          className={[
            "group flex w-full items-center gap-2 rounded-md py-1.5 pe-1 text-start transition",
            selected
              ? "bg-[#E7F3FF] text-[#1877F2]"
              : "text-[#050505] hover:bg-[#F0F2F5]",
          ].join(" ")}
          style={{ paddingInlineStart: 8 + depth * 14 }}
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
          <div className="absolute end-1 top-8 z-20 min-w-[150px] rounded-md border border-[#CED0D4] bg-white py-1 shadow-lg">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className="block w-full px-3 py-1.5 text-start text-[13px] text-[#050505] hover:bg-[#F0F2F5]"
                onClick={() => setMenuId(null)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <nav
      aria-label={c("treeTitle")}
      className="flex h-full flex-col border-e border-[#CED0D4] bg-[#F7F8FA]"
    >
      <div className="border-b border-[#E4E6EB] px-3 py-2.5">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#65676B]">
          {c("treeTitle")}
        </p>
        <label className="mt-2 block lg:hidden">
          <span className="sr-only">{c("treeTitle")}</span>
          <select
            className="h-11 w-full rounded-md border border-[#CED0D4] bg-white px-2 text-[13px] font-semibold"
            value={selectedId}
            onChange={(event) => {
              const node = nodes.find((row) => row.id === event.target.value);
              if (node) onSelect(node.level, node.id);
            }}
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.level === "campaign"
                  ? node.name
                  : node.level === "adset"
                    ? `↳ ${node.name}`
                    : `↳↳ ${node.name}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="hidden flex-1 space-y-0.5 overflow-y-auto px-1.5 py-2 lg:block">
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
