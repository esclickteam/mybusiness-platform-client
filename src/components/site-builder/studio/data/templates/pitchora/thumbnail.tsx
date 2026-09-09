import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function PitchoraThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#05070F", color: "#F8FAFC", fontFamily: "Assistant, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#FFB703", color: "#fff" }}>{tx("סוכנות פיץ' ויחסי משקיעים")}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Pitchora</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">dark pitch-deck slides</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#101522", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#FB8500", color: "#111827" }}>72</div>
      </div>
    </div>
  );
}
